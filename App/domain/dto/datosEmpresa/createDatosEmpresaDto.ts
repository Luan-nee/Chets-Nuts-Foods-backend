import { createDatosEmpresaValidator } from "../../validators/datosEmpresa/datosEmpresaValidator.js";

export class CreateDatosEmpresaDto {
  public ruc: string;
  public denominacion: string;
  public numeroRegistroMtc: string;
  public codigoMtc: string;
  public urlApi?: string;
  public claveAcceso?: string;

  private constructor({
    claveAcceso,
    codigoMtc,
    denominacion,
    numeroRegistroMtc,
    ruc,
    urlApi,
  }: CreateDatosEmpresaDto) {
    this.claveAcceso = claveAcceso;
    this.codigoMtc = codigoMtc;
    this.denominacion = denominacion;
    this.numeroRegistroMtc = numeroRegistroMtc;
    this.ruc = ruc;
    this.urlApi = urlApi;
  }

  static createDatosEmpresa(input: any): [string?, CreateDatosEmpresaDto?] {
    const validator = createDatosEmpresaValidator(input);

    if (!validator.success) {
      return [validator.error.message, undefined];
    }
    return [undefined, new CreateDatosEmpresaDto(validator.data)];
  }
}
