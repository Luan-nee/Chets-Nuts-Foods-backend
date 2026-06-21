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
      estadoacceso: varchar(50)
        .Check(["DISPONIBLE", "OCUPADO", "OBSERVACION"])
        .Default("DISPONIBLE")
        .$(),
      fechaCreacion: timestamp().now().$(),
    }),
    datosempresa: defineTable("datosempresa", {
      idDatosEmpresa: int().Pk().Required().$(),
      ruc: varchar(15).Required().$(),
      denominacion: varchar(150).Required().$(),
      numeroRegistroMtc: varchar(30).Required().$(),
      codigoMtc: varchar(30).Required().$(),
      correo: varchar(150).Required().$(),
      urlApi: varchar(250).Default("none").$(),
      claveAcceso: varchar(380).Default("none").$(),
      tipo: varchar(30).Check(["TEST", "PROD"]).Default("TEST").$(),
      fechavigenciaregistro: timestamp().required().$(),
    }),
    establecimientos: defineTable("establecimientos", {
      idEst: int().Pk().Required().$(),
      idUsuarioResponsable: int().Required().$(),
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
      pesounitario: money(10, 3).required().$(), //kg
      cantidad: int().Default(1).$(),
      pesototal: money(10, 3).default(0).$(),
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
      tipogeneration: varchar(20).$(),
      estadoguia: varchar(20)
        .Check(["ACEPTADO", "RECHAZADO", "OBSERVADO"])
        .Default("ACEPTADO")
        .$(),
      numero: varchar().$(),
      hash: varchar(180).$(),
      qrUrl: varchar(200).$(),
      confirmado: bool().default(false).$(),
      datagenerate: varchar(700).$(),
      fechaupdate: timestamp().onUpdate().$(),
      fechaConfirmacion: timestamp().$(),
    }),
    paquetes: defineTable("paquetes", {
      //envios
      idenvio: int().Pk().Required().$(),
      idusuario: int().Required().$(),
      idusuarioDestino: int().Required().$(),
      idsalidatransporte: int().Required().$(),
      idDestinoEstablecimiento: int().$(),
      destino: varchar(50).$(),
      clave: varchar(10).Required().$(),
      montocobrado: money().required().$(),
      estadopaquete: varchar(50)
        .Check([
          "ENTREGADO",
          "CAMINO",
          "DETENIDO",
          "HOME",
          "CANCELADO",
          "REVISION",
        ]) //revision esperando aprobacion de la sunat
        .Default("HOME")
        .$(),
      observacion: varchar(300).$(), //en caso la policia lo detenga o ocurra algo con el paquete
      cantidadproduct: int().Default(0).$(),
      ultimaactualizacion: timestamp().onUpdate().$(),
      fechacreado: timestamp().now().$(),
    }),

    salidatransporte: defineTable("salidatransporte", {
      idsalidatransporte: int().Pk().Required().$(),
      idvehiculo: int().Required().$(),
      idchoferacceso: int().Required().$(),
      idchoferaccesosecundario: int().$(),
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
      idsalidatransporte: int().Required().$(),
      idcontrolestablecimiento: int()
        .Comment("En caso de haber pasado por algun establecimiento")
        .$(),
      latitud: varchar(50).$(),
      longitud: varchar(50).$(),
      direccion: varchar(70).$(),
      titulo: varchar(100).Required().$(),
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
      tiposervicio: varchar(100)
        .Check(["PUBLICO", "PRIVADO"])
        .Default("PRIVADO")
        .$(),
      estadovehiculo: varchar(100)
        .Check(["OPERATIVO", "INACTIVO", "RESERVADO"])
        .Default("OPERATIVO")
        .$(),
      fechacreado: timestamp().now().$(),
    }),
    productsdefect: defineTable("productsdefect", {
      idproductdefect: int().Pk().Required().$(),
      creatoracceso: int().Required().$(),
      nombre: varchar(250).Required().$(),
      descripcion: varchar(300).$(),
      fechacreation: timestamp().now().$(),
    }),

    notificaciones: defineTable("notificaciones", {
      idnotificacion: int().Pk().Required().$(),
      titulonotificacion: varchar(150).Required().$(),
      descripcion: varchar(650).Comment("cuando es socket llega json").$(),
      estado: bool().default(true).$(),
      tiponotificacion: varchar(50)
        .Check(["socket", "anuncio", "informe"])
        .Default("anuncio")
        .$(),
      detalletipo: varchar(50).$(),
      fechaejecute: timestamp().required().$(),
      fechacreate: timestamp().now().$(),
    }),
  };
}
