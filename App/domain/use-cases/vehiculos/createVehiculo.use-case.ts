import { AND, DB, eq, OR, UP } from "zormz";
import { CreateCarroDto } from "../../dto/autosEmpresa/createCarro.dto.js";
import { generateTables } from "../../../BD-Control.js";
import { CustomError } from "../../../core/res/Custom.error.js";
import { createVehiculoEmpresa } from "../../../SQL/atajosSql.js";
import { UpdateCarroDto } from "../../dto/autosEmpresa/updateCarro.dto.js";
import { UpdateParam } from "../../../consts.js";

interface selectCarro {
  placa: string;
  idvehempresa: number;
  capacidadCarga: string;
}

export class CreateVehiculoUseCase {
  async selectVehiculo(id: number) {
    const { vehiculosempresa } = generateTables();
    const automovil = (await DB.Select([
      vehiculosempresa.placa,
      vehiculosempresa.marca,
      vehiculosempresa.modelo,
      vehiculosempresa.anio,
      vehiculosempresa.vin,
      vehiculosempresa.numeroHabilitacion,
      vehiculosempresa.capacidadCarga,
      vehiculosempresa.fechacreado,
    ])
      .from(vehiculosempresa())
      .where(eq(vehiculosempresa.idvehempresa, id))
      .execute()) as CreateCarroDto[];

    return automovil;
  }

  async validateVehiculo(carro: CreateCarroDto) {
    const { vehiculosempresa } = generateTables();

    const automovilValidate = (await DB.Select([
      vehiculosempresa.placa,
      vehiculosempresa.idvehempresa,
      vehiculosempresa.capacidadCarga,
    ])
      .from(vehiculosempresa())
      .where(
        OR(
          eq(vehiculosempresa.marca, carro.marca),
          eq(vehiculosempresa.modelo, carro.modelo),
          eq(vehiculosempresa.tipoVehiculo, carro.tipoVehiculo),
        ),
      )
      .execute()) as selectCarro[];

    if (automovilValidate.length > 0) {
      throw CustomError.badRequest("Este vehiculo ya esta registrado");
    }
  }

  async createVehiculo(carro: CreateCarroDto) {
    await this.validateVehiculo(carro);
    const id = await createVehiculoEmpresa(carro);
    const automovil = this.selectVehiculo(id);
    return automovil;
  }

  async getAllVehiculo() {
    const { vehiculosempresa } = generateTables();

    const vehiculos = await DB.Select([
      vehiculosempresa.placa,
      vehiculosempresa.marca,
      vehiculosempresa.modelo,
      vehiculosempresa.anio,
      vehiculosempresa.tipoVehiculo,
      vehiculosempresa.capacidadCarga,
    ])
      .from(vehiculosempresa())
      .execute();

    return vehiculos;
  }

  async getChoferes() {
    const { usuarios, accesos } = generateTables();

    const choferes = await DB.Select([
      usuarios.nombres,
      usuarios.apellidopaterno,
      usuarios.apellidomaterno,
      `${accesos.idacceso} AS idUser`,
      usuarios.dniuser,
      usuarios.edad,
      usuarios.numeroLicenciaConducir,
      usuarios.rucuser,
      accesos.tipos,
    ])
      .from(accesos())
      .innerJOIN(usuarios(), eq(accesos.idusuario, usuarios.iduser))
      .where(eq(usuarios.tipo, "CHOFER"))
      .execute();

    return choferes;
  }
  async updateVehiculo({
    idVehiculo,
    anio,
    capacidadCarga,
    marca,
    modelo,
    numeroHabilitacion,
    tipoVehiculo,
    vin,
  }: UpdateCarroDto) {
    const { vehiculosempresa } = generateTables();

    const query: UpdateParam[] = [];

    if (anio !== undefined) {
      query.push(UP(vehiculosempresa.anio, anio));
    }

    if (capacidadCarga !== undefined) {
      query.push(
        UP(vehiculosempresa.capacidadCarga, `${capacidadCarga}`, true),
      );
    }

    if (marca !== undefined) {
      query.push(UP(vehiculosempresa.marca, marca));
    }

    if (modelo !== undefined) {
      query.push(UP(vehiculosempresa.modelo, modelo));
    }

    if (numeroHabilitacion !== undefined) {
      query.push(UP(vehiculosempresa.numeroHabilitacion, numeroHabilitacion));
    }

    if (tipoVehiculo !== undefined) {
      query.push(UP(vehiculosempresa.tipoVehiculo, tipoVehiculo));
    }

    if (vin !== undefined) {
      query.push(UP(vehiculosempresa.vin, vin));
    }

    if (query.length === 0) {
      throw CustomError.badRequest("No hay datos para actualizar");
    }

    await DB.Update(vehiculosempresa())
      .set(query)
      .where(eq(vehiculosempresa.idvehempresa, idVehiculo))
      .execute();
    return "ok";
  }
}
