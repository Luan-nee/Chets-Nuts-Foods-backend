export interface typePackage {
  destino: string | null;
  idDestinoEstablecimiento: number | null;
  estadopaquete: estadoPaquete;
  cantidadproduct: number;
  idsalidatransporte: number;
  idusuario: number;
  idusuarioDestino: number;
  montocobrado: number;
  observacion: string;
  idorigenestablecimiento: number;
  estadotransporte: salidaTransType;
  idchoferacceso: number;
  fechasalida: Date;
  ultimaactualizacion: Date;
  fechacreado: Date;
}

export interface usuarioType {
  iduser: number;
  nombres: string;
  apellidomaterno: string;
  dniuser: string;
  rucuser: string;
}

export interface establecimientoType {
  nombreEst: string;
  codigoSunat: string;
  ubigeo: string;
  departamento: string;
  provincia: string;
  distrito: string;
}

export interface productosClientType {
  nombreproducto: string;
  pesounitario: number;
  cantidad: number;
  pesototal: number;
  observacion: string;
  fechacreacion: Date;
}
