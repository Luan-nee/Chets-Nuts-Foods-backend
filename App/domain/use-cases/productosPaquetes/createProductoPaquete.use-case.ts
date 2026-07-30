import { AND, DB, eq, ILIKE, SUM, UP } from "zormz";
import { generateTables } from "../../../BD-Control.js";
import { CreateProductoPaqueteDto } from "../../dto/productosPaquete/createProducto.dto.js";
import { estadoPaquete, salidaTransType } from "../../../types/global.js";
import { CustomError } from "../../../core/res/Custom.error.js";

interface paqueteResponse {
  idenvio: number;
  estadopaquete: estadoPaquete;
  idsalidatransporte: number;
}

interface salidaTransporteResponse {
  estadotransporte: salidaTransType;
  fechacreado: Date;
}

interface productoValidate {
  nombreproducto: string;
  id: number;
  idenvio: number;
  pesounitario: number;
  cantidad: number;
}

interface productosandPeso {
  cantidad: number;
  peso: number;
}

export class CreateProductoPaqueteUseCase {
  private async validatePaquete(idpaquete: number) {
    const { paquetes, salidatransporte } = generateTables();

    const paqueteValid = (await DB.Select([
      paquetes.idenvio,
      paquetes.estadopaquete,
      paquetes.idsalidatransporte,
    ])
      .from(paquetes())
      .where(eq(paquetes.idenvio, idpaquete))
      .execute()) as paqueteResponse[];

    if (paqueteValid.length === 0) {
      throw CustomError.badRequest("Este paquete no existe");
    }

    const [salidaTransValidate] = (await DB.Select([
      salidatransporte.estadotransporte,
      salidatransporte.fechacreado,
    ])
      .from(salidatransporte())
      .where(
        eq(
          salidatransporte.idsalidatransporte,
          paqueteValid[0].idsalidatransporte,
        ),
      )
      .execute()) as salidaTransporteResponse[];

    if (salidaTransValidate.estadotransporte !== "INICIO") {
      throw CustomError.badRequest(
        `La salida esta en estado ${salidaTransValidate.estadotransporte} no se puede agregar mas productos`,
      );
    }
  }

  async getPesoProductosPaquete(
    idPaquete: number,
  ): Promise<null | productosandPeso> {
    const { productos } = generateTables();

    const producto = (await DB.Select([
      productos.pesounitario,
      productos.cantidad,
    ])
      .from(productos())
      .where(AND(eq(productos.idenvio, idPaquete)))
      .execute()) as productoValidate[];

    if (producto.length === 0) {
      return null;
    }

    let sumaPeso = 0;

    producto.forEach((prod) => {
      sumaPeso += prod.cantidad * prod.pesounitario;
    });

    return {
      cantidad: producto.length,
      peso: sumaPeso,
    };
  }

  async validatePesoAutomovil(idPaquete: number, peso: number) {
    const { vehiculosempresa, paquetes, salidatransporte } = generateTables();

    const idVehiculo = (await DB.Select([
      salidatransporte.idvehiculo,
      salidatransporte.idsalidatransporte,
    ])
      .from(salidatransporte())
      .innerJOIN(
        paquetes(),
        eq(
          paquetes.idsalidatransporte,
          salidatransporte.idsalidatransporte,
          false,
        ),
      )
      .where(eq(paquetes.idenvio, idPaquete))
      .execute()) as { idvehiculo: number; idsalidatransporte: number }[];

    if (idVehiculo.length > 1 || idVehiculo.length === 0) {
      throw CustomError.badRequest(
        "El vehiculo no existe o no esta registrado",
      );
    }

    const validateV = (await DB.Select([vehiculosempresa.capacidadCarga])
      .from(vehiculosempresa())
      .where(eq(vehiculosempresa.idvehempresa, idVehiculo[0].idvehiculo))
      .execute()) as { capacidadCarga: number }[];

    console.log(validateV);
    console.log(`peso:${peso}`);

    if (validateV.length === 0) {
      throw CustomError.badRequest("No existe este vehiculo");
    }

    if (peso > validateV[0].capacidadCarga) {
      throw CustomError.badRequest(
        "El peso de este producto excedio la capacidad del carro",
      );
    }
  }

  async execute(productoDto: CreateProductoPaqueteDto, idpaquete: number) {
    const { productos, paquetes } = generateTables();

    await this.validatePaquete(idpaquete);

    const query = [
      productos.idenvio,
      productos.nombreproducto,
      productos.pesounitario,
      productos.cantidad,
    ];

    const data = [
      idpaquete,
      productoDto.nombreproducto,
      productoDto.pesounitario,
      productoDto.cantidad,
    ];

    if (productoDto.observacion !== undefined) {
      query.push(productos.observacion);
      data.push(productoDto.observacion);
    }

    const productoVal = await this.getPesoProductosPaquete(idpaquete);

    let pesoProductos = productoVal === null ? 0 : productoVal.peso;

    console.log(productoDto);
    const pesoTotal = productoDto.cantidad * productoDto.pesounitario;
    console.log(`peso Producto : ${pesoTotal}`);

    await this.validatePesoAutomovil(idpaquete, pesoTotal + pesoProductos);

    query.push(productos.pesototal);
    data.push(pesoTotal);

    const idProductoNuevo = await DB.Insert(productos(), query)
      .Values(data)
      .Returning(productos.id)
      .execute();
    if (idProductoNuevo === undefined || idProductoNuevo.length === 0) {
      throw CustomError.badRequest("No se pudo agregar al producto");
    }

    await DB.Update(paquetes())
      .set([UP(paquetes.cantidadproduct, "1", true)])
      .where(eq(paquetes.idenvio, idpaquete))
      .execute();

    await this.createProductDefect(
      productoDto.nombreproducto,
      productoDto.observacion || "",
    );

    return idProductoNuevo[0];
    /*
    if (productoVal === null) {
    } else {
      const cantidadTotal = productoVal.cantidad + productoDto.cantidad;
      const pesoTotal = productoVal.pesounitario * cantidadTotal;

      await this.validatePesoAutomovil(idpaquete, pesoTotal);

      return productoVal.id;
    }*/
  }

  private async createProductDefect(nombre: string, descripcion: string) {
    const { productsdefect } = generateTables();
    const id = await DB.Select([productsdefect.idproductdefect])
      .from(productsdefect())
      .where(ILIKE(productsdefect.nombre, `%${nombre}%`))
      .execute();
    if (id.length !== 0) {
      return { estado: false, id: null };
    }

    const idnuevoDefect = await DB.Insert(productsdefect(), [
      productsdefect.nombre,
      productsdefect.descripcion,
      productsdefect.creatoracceso,
    ])
      .Values([nombre, descripcion, 1])
      .Returning(productsdefect.idproductdefect)
      .execute();
    if (!idnuevoDefect) {
      return {
        estado: false,
        id: null,
      };
    }
    return {
      estado: true,
      id: idnuevoDefect[0],
    };
  }
}
