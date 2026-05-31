import { datosInicio, schedulerTask } from "../consts.js";
import { emitRoomSocketInterno } from "../controllerSockets/globalSocket.js";
import {
  notificacionesTypes,
  NotificacionesUseCase,
} from "../domain/use-cases/notificaciones/notificaciones.use-case.js";
import { ConsultasInternas } from "../services/consultasInternas.js";
import { detallesSockets } from "../types/global.js";
import { Server as SocketIOServer } from "socket.io";

async function taskprivates(
  tareas: notificacionesTypes[],
  conexion: SocketIOServer,
) {
  const oldTasks = schedulerTask.getTasks();

  const nuevasTareas = tareas.filter(
    (tarea) => !oldTasks.includes(tarea.idnotificacion),
  );
  console.log(nuevasTareas);

  nuevasTareas.forEach((tarea) => {
    schedulerTask.agregarTarea(
      tarea.idnotificacion,
      tarea.fechaejecute,
      async () => {
        try {
          console.log("prueba de tareas ");
          if (tarea.tipo === "socket") {
            const descripciones: detallesSockets = JSON.parse(
              tarea.descripcion,
            );
            const tasks = descripciones.querys.map((n) => {
              ConsultasInternas.Update(n.tabla, n.condicional, n.setDatas);
              emitRoomSocketInterno({
                valore: descripciones.socketEmitData,
                conexion,
                messaje: tarea.titulonotificacion,
                response: descripciones.socketGroup,
              });
            });
            await Promise.all(tasks);
          } else if (tarea.tipo === "anuncio") {
            emitRoomSocketInterno({
              valore: "notificacion",
              conexion,
              messaje: tarea.descripcion,
              response: ["ADMINS", "SALIDATRANSPORTE", "ESTABLECIMIENTO"],
            });
          }

          await NotificacionesUseCase.updateNotificaciones(
            tarea.idnotificacion,
          );
        } catch (error) {
          console.log("ups Ocurrio un error");
          console.log(error);
        }
      },
    );
  });
}

export async function startTasks(conexion: SocketIOServer) {
  const fechaPrincipal = new Date();

  const fechaAumentada = new Date(fechaPrincipal);

  fechaAumentada.setHours(fechaPrincipal.getHours() + datosInicio.saltoHoras);
  console.log("inicio de tareas");

  console.log(fechaPrincipal);
  console.log(fechaAumentada);

  const tareas = await NotificacionesUseCase.getNotificaciones({
    fechainicio: fechaPrincipal,
    fechaFinal: fechaAumentada,
    estado: true,
  });

  await taskprivates(tareas, conexion);
}

export async function tareasPendientes(conexion: SocketIOServer) {
  const fechaPrincipal = new Date();

  const fechadisminuida = new Date(fechaPrincipal);
  fechaPrincipal.setHours(
    fechaPrincipal.getHours() + datosInicio.saltoHoras + 1,
  );
  fechadisminuida.setHours(fechaPrincipal.getHours() - datosInicio.saltoHoras);

  console.log("recuperando tareas");
  console.log(fechaPrincipal);
  console.log(fechadisminuida);

  const tareas = await NotificacionesUseCase.getNotificaciones({
    fechainicio: fechadisminuida,
    fechaFinal: fechaPrincipal,
    estado: true,
  });

  await taskprivates(tareas, conexion);
}
