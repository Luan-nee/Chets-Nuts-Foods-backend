import {
  departamentosPeru,
  departamentosPeruType,
  EstadosTipoEstablecimiento,
} from "../../../consts.js";
import { createEstablecimientoValidatos } from "../../validators/establecimiento/establecimientoValidator.js";

export class CreateEstablecimientoDto {
  public idResponsable: number;
  public nombreEstablecimiento: string;
  public direccion: string;
  public descripcion: string;
  public latitud: string;
  public longitud: string;
  public distrito: string;
  public provincia: string;
  public departamento: departamentosPeruType;
  public ubigeo: string;
  public tipoEstado?: EstadosTipoEstablecimiento | undefined;
  public codigoSunat?: string;

  private constructor({
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
  }: CreateEstablecimientoDto) {
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
  }

  static CreateEstablecimientoAccess(
    input: any,
  ): [string?, CreateEstablecimientoDto?] {
    const resultado = createEstablecimientoValidatos(input);
    if (!resultado.success) {
      return [resultado.error.message, undefined];
    }

    return [undefined, new CreateEstablecimientoDto(resultado.data)];
  }
}
