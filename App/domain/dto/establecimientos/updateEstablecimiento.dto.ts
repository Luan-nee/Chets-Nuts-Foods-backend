import { EstadosTipoEstablecimiento } from "../../../consts.js";
import { updateEstablecimientoValidator } from "../../validators/establecimiento/establecimientoValidator.js";

export class UpdateEstablecimientoDTO {
  public idEstablecimiento: number;
  public idResponsable?: number;
  public nombreEstablecimiento?: string;
  public direccion?: string;
  public descripcion?: string;
  public latitud?: string;
  public longitud?: string;
  public distrito?: string;
  public provincia?: string;
  public departamento?: string;
  public ubigeo?: string;
  public tipoEstado?: EstadosTipoEstablecimiento | undefined;
  public codigoSunat?: string;
  public activo?: boolean;

  private constructor({
    idEstablecimiento,
    departamento,
    descripcion,
    direccion,
    distrito,
    idResponsable,
    latitud,
    longitud,
    nombreEstablecimiento,
    provincia,
    tipoEstado,
    codigoSunat,
    ubigeo,
    activo,
  }: UpdateEstablecimientoDTO) {
    this.idEstablecimiento = idEstablecimiento;
    this.departamento = departamento;
    this.descripcion = descripcion;
    this.direccion = direccion;
    this.distrito = distrito;
    this.idResponsable = idResponsable;
    this.latitud = latitud;
    this.longitud = longitud;
    this.nombreEstablecimiento = nombreEstablecimiento;
    this.provincia = provincia;
    this.tipoEstado = tipoEstado;
    this.codigoSunat = codigoSunat;
    this.ubigeo = ubigeo;
    this.activo = activo;
  }

  static CreateEstablecimientoAccess(
    input: any,
  ): [string?, UpdateEstablecimientoDTO?] {
    const resultado = updateEstablecimientoValidator(input);
    if (!resultado.success) {
      return [resultado.error.message, undefined];
    }

    return [undefined, new UpdateEstablecimientoDTO(resultado.data)];
  }
}
