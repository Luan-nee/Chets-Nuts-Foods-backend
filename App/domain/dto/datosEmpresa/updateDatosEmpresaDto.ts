import { responseZodError } from "../../../core/config/responseZodError.js";
import { updateDatosEmpresaValidator } from "../../validators/datosEmpresa/datosEmpresaValidator.js";

export class UpdateDatosEmpresaDTO {
  public ruc?: string;
  public denominacion?: string;
  public numeroRegistroMtc?: string;
  public codigoMtc?: string;
  public correo?: string;
  public urlApi?: string;
  public claveAcceso?: string;
  public fechaVigenciaRegistroMtc?: Date;

  private constructor({
    claveAcceso,
    codigoMtc,
    denominacion,
    numeroRegistroMtc,
    ruc,
    urlApi,
    correo,
    fechaVigenciaRegistroMtc,
  }: UpdateDatosEmpresaDTO) {
    this.claveAcceso = claveAcceso;
    this.codigoMtc = codigoMtc;
    this.denominacion = denominacion;
    this.numeroRegistroMtc = numeroRegistroMtc;
    this.ruc = ruc;
    this.urlApi = urlApi;
    this.correo = correo;
    this.fechaVigenciaRegistroMtc = fechaVigenciaRegistroMtc;
  }

  static createDatosEmpresa(input: any): [string?, UpdateDatosEmpresaDTO?] {
    const validator = updateDatosEmpresaValidator(input);
    console.log(validator);
    if (!validator.success) {
      const error = responseZodError(validator);
      return [error, undefined];
    }
    return [undefined, new UpdateDatosEmpresaDTO(validator.data)];
  }
}
