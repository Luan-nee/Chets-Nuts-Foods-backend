import { AND, DB, eq, MAYOR, MENOR, UP } from "zormz";
import { generateTables } from "../../../BD-Control.js";

type tipoNotificaciones = "socket" | "anuncio" | "informe";

interface parametrosType {
  fechainicio: Date;
  fechaFinal: Date;
  estado: boolean;
}

export interface notificacionesTypes {
  idnotificacion: number;
  titulonotificacion: string;
  descripcion: string;
  estado: boolean;
  tipo: tipoNotificaciones;
  detalletipo: string;
  fechaejecute: Date;
  fechacreate: Date;
}

export class NotificacionesUseCase {
  public titulonotificacion: string;
  public descripcion: string;
  public estado?: boolean;
  public tipo?: tipoNotificaciones;
  public detalletipo?: string;
  public fechaejecute: Date;

  private constructor({
    descripcion,
    estado,
    fechaejecute,
    tipo,
    titulonotificacion,
  }: NotificacionesUseCase) {
    this.descripcion = descripcion;
    this.titulonotificacion = titulonotificacion;
    this.estado = estado;
    this.tipo = tipo;
    this.fechaejecute = fechaejecute;
  }

  static async createNotificacion(notificacion: NotificacionesUseCase) {
    const { notificaciones } = generateTables();

    notificacion.fechaejecute.setHours(
      notificacion.fechaejecute.getHours() + 5,
    );

    const inserts: any[] = [
      notificacion.titulonotificacion,
      notificacion.descripcion,
      notificacion.fechaejecute,
    ];

    const parametros = [
      notificaciones.titulonotificacion,
      notificaciones.descripcion,
      notificaciones.fechaejecute,
    ];

    if (notificacion.estado !== undefined) {
      parametros.push(notificaciones.estado);
      inserts.push(notificacion.estado);
    }

    if (notificacion.tipo !== undefined) {
      parametros.push(notificaciones.tiponotificacion);
      inserts.push(notificacion.tipo);
    }

    if (notificacion.detalletipo !== undefined) {
      parametros.push(notificaciones.detalletipo);
      inserts.push(notificacion.detalletipo);
    }

    const id = await DB.Insert(notificaciones(), parametros)
      .Values(inserts)
      .Returning(notificaciones.idnotificacion)
      .execute();

    return id;
  }

  static async getNotificaciones({
    fechainicio,
    fechaFinal,
    estado = true,
  }: parametrosType): Promise<notificacionesTypes[]> {
    const { notificaciones } = generateTables();

    const response = (await DB.Select([
      notificaciones.idnotificacion,
      notificaciones.titulonotificacion,
      notificaciones.descripcion,
      notificaciones.estado,
      notificaciones.tiponotificacion,
      notificaciones.detalletipo,
      notificaciones.fechaejecute,
      notificaciones.fechacreate,
    ])
      .from(notificaciones())
      .where(
        AND(
          MAYOR(notificaciones.fechaejecute, `'${fechainicio.toISOString()}'`),
          MENOR(notificaciones.fechaejecute, `'${fechaFinal.toISOString()}'`),
          eq(notificaciones.estado, estado),
        ),
      )
      .execute()) as notificacionesTypes[];

    return response;
  }

  static async updateNotificaciones(id: number) {
    const { notificaciones } = generateTables();
    await DB.Update(notificaciones())
      .set([UP(notificaciones.estado, `${false}`, false)])
      .where(eq(notificaciones.idnotificacion, id))
      .execute();
  }
}
