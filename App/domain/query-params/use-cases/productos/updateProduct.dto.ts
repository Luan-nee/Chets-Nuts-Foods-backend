import { updateProductsValidator } from "../../../validators/productos/producto.validator.js";

export class UpdateProductDto {
  public sku?: string | null;
  public nombre?: string | null;
  public stock_actual?: number | null;
  public stock_minimo?: number | null;
  public porcentaje_ganancia?: string | null;
  public precio_compra_proveedor?: number | null;
  public descripcion?: string | null;

  private constructor({
    sku,
    nombre,
    stock_actual,
    stock_minimo,
    porcentaje_ganancia,
    precio_compra_proveedor,
    descripcion,
  }: UpdateProductDto) {
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.porcentaje_ganancia = porcentaje_ganancia;
    this.precio_compra_proveedor = precio_compra_proveedor;
    this.stock_actual = stock_actual;
    this.stock_minimo = stock_minimo;
    this.sku = sku;
  }

  private static isEmptyUpdate(data: UpdateProductDto): boolean {
    return Object.values(data).every(
      (valor) => valor === undefined || valor === null || valor === ""
    );
  }

  static create(input: any): [string?, UpdateProductDto?] {
    const resultado = updateProductsValidator(input);
    if (!resultado.success) {
      return ["Los datos ingresados no estan permitidos", undefined];
    }

    if (this.isEmptyUpdate(resultado.data)) {
      return ["Datos Incorrectos o vacios", undefined];
    }

    return [undefined, new UpdateProductDto(resultado.data)];
  }
}
