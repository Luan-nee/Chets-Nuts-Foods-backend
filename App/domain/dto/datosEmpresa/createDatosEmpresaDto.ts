import { createDatosEmpresaValidator } from "../../validators/datosEmpresa/datosEmpresaValidator.js";

export class CreateDatosEmpresaDto {
  public ruc: string;
  public denominacion: string;
  public numeroRegistroMtc: string;
  public codigoMtc: string;
  public correo: string;
  public urlApi?: string;
  public claveAcceso?: string;
  public fechaVigenciaRegistroMtc: Date;

  private constructor({
    claveAcceso,
    codigoMtc,
    denominacion,
    numeroRegistroMtc,
    ruc,
    urlApi,
    correo,
    fechaVigenciaRegistroMtc,
  }: CreateDatosEmpresaDto) {
    this.claveAcceso = claveAcceso;
    this.codigoMtc = codigoMtc;
    this.denominacion = denominacion;
    this.numeroRegistroMtc = numeroRegistroMtc;
    this.ruc = ruc;
    this.urlApi = urlApi;
    this.correo = correo;
    this.fechaVigenciaRegistroMtc = fechaVigenciaRegistroMtc;
  }

  static createDatosEmpresa(input: any): [string?, CreateDatosEmpresaDto?] {
    const validator = createDatosEmpresaValidator(input);
    console.log(validator);
    if (!validator.success) {
      return [validator.error.message, undefined];
    }
    return [undefined, new CreateDatosEmpresaDto(validator.data)];
  }
}
