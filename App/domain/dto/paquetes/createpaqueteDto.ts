import { createDatosEmpresaValidator } from "../../validators/datosEmpresa/datosEmpresaValidator.js";

export class CreatePaqueteDto {
  public idusuario: number;
  public idchofer: number;
  public idvehiculo: number;
  public idusuariodestino: number;
  public idorigenestablecimiento: number;
  public iddestinoestablecimiento: number;
  public clave: string;
  public montocobrado: number;
  public destino: string;

  private constructor({
    clave,
    destino,
    idchofer,
    iddestinoestablecimiento,
    idorigenestablecimiento,
    idusuario,
    idusuariodestino,
    idvehiculo,
    montocobrado,
  }: CreatePaqueteDto) {
    this.idusuario = idusuario;
    this.idchofer = idchofer;
    this.idvehiculo = idvehiculo;
    this.idusuariodestino = idusuariodestino;
    this.iddestinoestablecimiento = iddestinoestablecimiento;
    this.idorigenestablecimiento = idorigenestablecimiento;
    this.clave = clave;
    this.destino = destino;
    this.montocobrado = montocobrado;
    console.log("agregando datos");
  }

  static createPaquete(input: any) {
    const validator = createDatosEmpresaValidator(input);
    if (!validator.success) {
      return [validator.error.message, undefined];
    }
  }
}
