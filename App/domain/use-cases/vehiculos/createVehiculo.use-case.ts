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

interface selectVehiculoData {
  idvehempresa: number;
  placa: string;
  marca: string;
  modelo: string;
  anio: string;
  vin?: string;
  numeroHabilitacion?: string;
  capacidadCarga: string;
  fechacreado: Date;
}

export class CreateVehiculoUseCase {
  async selectVehiculo(id: number) {
    const { vehiculosempresa } = generateTables();
    const automovil = (await DB.Select([
      vehiculosempresa.idvehempresa,
      vehiculosempresa.placa,
      vehiculosempresa.marca,
      vehiculosempresa.modelo,
      vehiculosempresa.anio,
      vehiculosempresa.vin,
      vehiculosempresa.numeroHabilitacion,
      vehiculosempresa.capacidadCarga,
      vehiculosempresa.fechacreado,
      vehiculosempresa.estadovehiculo,
    ])
      .from(vehiculosempresa())
      .where(eq(vehiculosempresa.idvehempresa, id))
      .execute()) as selectVehiculoData[];

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
        AND(
          eq(vehiculosempresa.placa, carro.placa),
          eq(vehiculosempresa.tipoVehiculo, carro.tipoVehiculo),
        ),
      )
      .execute()) as selectCarro[];

    console.log(automovilValidate);
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
      vehiculosempresa.idvehempresa,
      vehiculosempresa.placa,
      vehiculosempresa.marca,
      vehiculosempresa.modelo,
      vehiculosempresa.anio,
      vehiculosempresa.tipoVehiculo,
      vehiculosempresa.capacidadCarga,
      vehiculosempresa.estadovehiculo,
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
      .from(usuarios())
      .innerJOIN(accesos(), eq(usuarios.iduser, accesos.idusuario, false))
      .where(eq(accesos.tipos, "CHOFER"))
      .execute(true);

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
    estadoVehiculo,
  }: UpdateCarroDto) {
    const { vehiculosempresa } = generateTables();

    const query: UpdateParam[] = [];

    const verifyVec = await DB.Select([vehiculosempresa.idvehempresa])
      .from(vehiculosempresa())
      .where(eq(vehiculosempresa.idvehempresa, idVehiculo))
      .execute();

    if (verifyVec.length === 0) {
      throw CustomError.badRequest("Este vehiculo no existe");
    }

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

    if (estadoVehiculo !== undefined) {
      query.push(UP(vehiculosempresa.estadovehiculo, estadoVehiculo));
    }

    if (query.length === 0) {
      throw CustomError.badRequest("No hay datos para actualizar");
    }

    await DB.Update(vehiculosempresa())
      .set(query)
      .where(eq(vehiculosempresa.idvehempresa, idVehiculo))
      .execute();

    const vehiculo = await this.selectVehiculo(idVehiculo);

    return vehiculo;
  }
}
