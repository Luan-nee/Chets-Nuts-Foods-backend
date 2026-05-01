import { AND, DB, eq, UP } from "zormz";
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

  async getProductoPaquete(
    idPaquete: number,
    nombreproducto: string,
  ): Promise<null | productoValidate> {
    const { productos } = generateTables();

    const producto = (await DB.Select([
      productos.nombreproducto,
      productos.id,
      productos.idenvio,
      productos.pesounitario,
      productos.cantidad,
    ])
      .from(productos())
      .where(
        AND(
          eq(productos.idenvio, idPaquete),
          eq(productos.nombreproducto, nombreproducto),
        ),
      )
      .execute()) as productoValidate[];

    if (producto.length === 0) {
      return null;
    }
    return producto[0];
  }

  async validatePesoAutomovil(idPaquete: number, peso: number) {
    const { vehiculosempresa, paquetes, salidatransporte } = generateTables();

    const idVehiculo = (await DB.Select([salidatransporte.idvehiculo])
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
      .execute(true)) as { idvehiculo: number }[];

    console.log(idVehiculo);
    if (idVehiculo.length > 1 || idVehiculo.length === 0) {
      throw CustomError.badRequest(
        "El vehiculo no existe o no esta registrado",
      );
    }

    const validateV = (await DB.Select([vehiculosempresa.capacidadCarga])
      .from(vehiculosempresa())
      .where(eq(vehiculosempresa.idvehempresa, idVehiculo[0].idvehiculo))
      .execute()) as { capacidadCarga: number }[];

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
    const { productos } = generateTables();

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

    const productoVal = await this.getProductoPaquete(
      idpaquete,
      productoDto.nombreproducto,
    );

    if (productoVal === null) {
      const pesoTotal = productoDto.cantidad * productoDto.pesounitario;
      console.log(productoDto.cantidad);
      console.log(productoDto.pesounitario);
      console.log(pesoTotal);

      await this.validatePesoAutomovil(idpaquete, pesoTotal);

      query.push(productos.pesototal);
      data.push(pesoTotal);

      const idProductoNuevo = await DB.Insert(productos(), query)
        .Values(data)
        .Returning(productos.idenvio)
        .execute();

      if (idProductoNuevo === undefined || idProductoNuevo.length === 0) {
        throw CustomError.badRequest("No se pudo agregar al producto");
      }
      return idProductoNuevo[0];
    } else {
      const cantidadTotal = productoVal.cantidad + productoDto.cantidad;
      const pesoTotal = productoVal.pesounitario * cantidadTotal;

      await this.validatePesoAutomovil(idpaquete, pesoTotal);

      await DB.Update(productos())
        .set([
          UP(productos.cantidad, `${cantidadTotal}`),
          UP(productos.pesototal, `${pesoTotal}`),
        ])
        .where(eq(productos.id, productoVal.id))
        .execute();
      return productoVal.id;
    }
  }
}
