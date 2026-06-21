import { COUNT, DB } from "zormz";
import { generateTables } from "../../../BD-Control.js";
import { PageDataDto } from "../../query-params/pageData.dto.js";
import { paginationResponseSuccess } from "../../../core/config/paginationResponseSucces.js";

export class GetAllGR {
  async getAll(pagination: PageDataDto) {
    const { guiasremision } = generateTables();

    const guias = await DB.Select([
      guiasremision.estadoguia,
      guiasremision.numero,
      guiasremision.qrUrl,
      guiasremision.confirmado,
      guiasremision.fechaConfirmacion,
      guiasremision.idguia,
    ])
      .from(guiasremision())
      .OrderBy({ idguia: "DESC" })
      .LIMIT(10)
      .OFFSET((pagination.page - 1) * 10)
      .execute();

    const [cantidad] = (await DB.Select([
      COUNT(guiasremision.idguia, "cantidad"),
    ])
      .from(guiasremision())
      .execute()) as { cantidad: string }[];

    console.log(cantidad);
    const pag2 = paginationResponseSuccess(
      Number(cantidad.cantidad),
      pagination.page,
    );

    return { data: guias, pagination: pag2 };
  }
}
