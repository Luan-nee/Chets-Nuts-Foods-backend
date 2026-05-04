import { responseZodError } from "../../../core/config/responseZodError.js";
import { createSeguimientoValidator } from "../../validators/seguimiento/seguimiento.validator.js";

export class CreateSeguimientoDto {
  public titulo: string;
  public idcontrolestablecimiento?: number;
  public latitud?: string;
  public longitud?: string;
  public direccion?: string;
  public comentario?: string;

  constructor({
    comentario,
    direccion,
    latitud,
    longitud,
    titulo,
    idcontrolestablecimiento,
  }: CreateSeguimientoDto) {
    this.idcontrolestablecimiento = idcontrolestablecimiento;
    this.titulo = titulo;
    this.comentario = comentario;
    this.direccion = direccion;
    this.latitud = latitud;
    this.longitud = longitud;
  }

  static create(input: any): [string?, CreateSeguimientoDto?] {
    const response = createSeguimientoValidator(input);

    if (!response.success) {
      const error = responseZodError(response);
      return [error, undefined];
    }
    return [undefined, new CreateSeguimientoDto(response.data)];
  }
}
