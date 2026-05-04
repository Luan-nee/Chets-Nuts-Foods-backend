import { DB, eq } from "zormz";
import { generateTables } from "../../../BD-Control.js";
import { CustomError } from "../../../core/res/Custom.error.js";

interface productosInterface {
  nombreproducto: string;
  observacion: string;
  pesounitario: number;
  pesototal: number;
  fechacreacion: Date;
}

export class GetAllProductosPaqueteUseCase {
  async getpaquete(idpaquete: number) {
    const { paquetes, productos } = generateTables();

    const validatePaquete = await DB.Select([
      `${paquetes.idenvio} as idPaquete`,
    ])
      .from(paquetes())
      .where(eq(paquetes.idenvio, idpaquete))
      .execute();

    if (validatePaquete.length === 0) {
      throw CustomError.badRequest("No existe este paquete");
    }

    const productosPaquetes = (await DB.Select([
      productos.nombreproducto,
      productos.observacion,
      productos.pesounitario,
      productos.pesototal,
      productos.fechacreacion,
    ])
      .from(productos())
      .where(eq(productos.idenvio, idpaquete))
      .execute()) as productosInterface[];

    if (productosPaquetes.length === 0) {
      return [];
    }

    const pesoTotalPaquete = productosPaquetes.reduce((acumulador, produc) => {
      const suma = Number(acumulador) + Number(produc.pesototal);
      return suma;
    }, 0);
    return {
      productos: productosPaquetes,
      resumen: { totalPesoPaquete: pesoTotalPaquete },
    };
  }

  async execute(idpaquete: number) {
    return await this.getpaquete(idpaquete);
  }
}
