import { bool, defineTable, int, money, timestamp, varchar } from "zormz";

export function generateTables() {
  return {
    accesos: defineTable("accesos", {
      idacceso: int().Pk().Required().$(),
      idusuario: int().Required().$(),
      tipos: varchar(50)
        .Check(["ADMIN", "CHOFER", "CLIENTE", "COLABORADOR"])
        .Required()
        .$(),
      correo: varchar(200).Required().$(),
      contra: varchar(50).Required().$(),
      estado: bool().default(true).$(),
      fechaCreacion: timestamp().now().$(),
    }),
    datosempresa: defineTable("datosempresa", {
      idDatosEmpresa: int().Pk().Required().$(),
      ruc: varchar(15).Required().$(),
      denominacion: varchar(150).Required().$(),
      numeroRegistroMtc: varchar(30).Required().$(),
      codigoMtc: varchar(30).Required().$(),
      correo: varchar(150).Required().$(),
      urlApi: varchar(150).Default("none").$(),
      claveAcceso: varchar(80).Default("none").$(),
      fechavigenciaregistro: timestamp().required().$(),
    }),
    establecimientos: defineTable("establecimientos", {
      idEst: int().Pk().Required().$(),
      idUsuarioResponsable: int().Unique().Required().$(),
      codigoSunat: varchar(5).$(),
      nombreEst: varchar(100).Required().$(),
      direccion: varchar(150).Required().$(),
      descripcion: varchar(200).$(),
      latitud: varchar(70).Required().$(),
      longitud: varchar(70).Required().$(),
      distrito: varchar(70).Required().$(),
      provincia: varchar(70).Required().$(),
      departamento: varchar(70).Required().$(),
      ubigeo: varchar(15).Required().$(),
      tipoestablecimiento: varchar()
        .Check(["fiscal", "anexo", "almacen", "oficina", "noRegistrado"])
        .Default("oficina")
        .$(),
      activo: bool().default(true).$(),
      fechaCreacion: timestamp().now().$(),
    }),
    productos: defineTable("productos", {
      id: int().Pk().Required().$(),
      idenvio: int().Required().$(),
      nombreproducto: varchar(150).Required().$(),
      observacion: varchar(150).$(), //en caso de ser vidrio
      peso: varchar(50).Required().$(), //kg
      fechacreacion: timestamp().now().$(),
      fechaactualizado: timestamp().onUpdate().$(),
    }),
    usuarios: defineTable("usuarios", {
      iduser: int().Pk().Required().$(),
      nombres: varchar(100).Required().$(),
      apellidomaterno: varchar(50).Required().$(),
      apellidopaterno: varchar(50).Required().$(),
      edad: int().Default(18).$(),
      dniuser: varchar(10).$(),
      rucuser: varchar(15).$(),
      tipo: varchar(50).Check(["NATURAL", "JURIDICO"]).Default("NATURAL").$(),
      estado: bool().default(true).$(),
      numero: varchar(50).$(),
      numeroLicenciaConducir: varchar(20).$(),
      correo: varchar(100).$(),
      cantenvios: int().Default(0).$(),
      fechacreado: timestamp().now().$(),
    }),
    guiasremision: defineTable("guiasremision", {
      idguia: int().Pk().Required().$(),
      idpaquete: int().$(),
      numero: varchar().$(),
      qrUrl: varchar(200).$(),
      fechaConfirmacion: timestamp().now().$(),
    }),
    paquetes: defineTable("paquetes", {
      //envios
      idenvio: int().Pk().Required().$(),
      idusuario: int().Required().$(),
      idusuarioDestino: int().Required().$(),
      idsalidatransporte: int().Required().$(),
      idDestinoEstablecimiento: int().Required().$(),
      destino: varchar(50).$(),
      clave: varchar(10).Required().$(),
      montocobrado: money().required().$(),
      estadopaquete: varchar(50)
        .Check(["ENTREGADO", "CAMINO", "DETENIDO", "CANCELADO", "REVISION"]) //revision esperando aprobacion de la sunat
        .$(),
      observacion: varchar(300).$(), //en caso la policia lo detenga o ocurra algo con el paquete
      ultimaactualizacion: timestamp().onUpdate().$(),
    }),

    salidatransporte: defineTable("salidatransporte", {
      idsalidatransporte: int().Pk().Required().$(),
      idvehiculo: int().Required().$(),
      idchoferacceso: int().Required().$(),
      idorigenestablecimiento: int().Required().$(),
      iddestinoestablecimiento: int().Required().$(),
      fechasalida: timestamp().required().$(),
      estadotransporte: varchar(50)
        .Check(["INICIO", "EN CAMINO", "FINALIZADO", "CANCELADO"])
        .Default("INICIO")
        .$(),
      fechafinalizado: timestamp().$(),
      fechacreado: timestamp().now().$(),
    }),

    seguimientopaquetes: defineTable("seguimientopaquetes", {
      idseg: int().Pk().Required().$(),
      idpaquete: int().Required().$(),
      idcontrolestablecimiento: int()
        .Comment("En caso de haber pasado por algun establecimiento")
        .$(),
      latitud: varchar(50).$(),
      longitud: varchar(50).$(),
      direccion: varchar(70).$(),
      comentario: varchar(150)
        .Comment("En caso quiera agregar alguna informacion")
        .$(),
      fecharegistro: timestamp().now().$(),
    }),
    vehiculosempresa: defineTable("vehiculosempresa", {
      idvehempresa: int().Pk().Required().$(),
      placa: varchar(10).Required().$(),
      marca: varchar(10).Required().$(),
      modelo: varchar(10).Required().$(),
      anio: varchar(5).Required().$(),
      tipoVehiculo: varchar(20).$(),
      vin: varchar(100).$(),
      numeroHabilitacion: varchar(150).$(),
      capacidadCarga: money().required().$(),
      estado: bool().default(true).$(),
      fechacreado: timestamp().now().$(),
    }),
  };
}
