import { datosInicio, schedulerTask } from "../consts.js";
import { NotificacionesUseCase } from "../domain/use-cases/notificaciones/notificaciones.use-case.js";

export async function startTasks() {
  const fechaPrincipal = new Date();

  const fechaAumentada = new Date(
    fechaPrincipal.setHours(fechaPrincipal.getHours() + datosInicio.saltoHoras),
  );

  console.log("inicio de tareas");
  const tareas = await NotificacionesUseCase.getNotificaciones({
    fechainicio: fechaPrincipal,
    fechaFinal: fechaAumentada,
    estado: true,
  });

  tareas.forEach((tarea) => {
    schedulerTask.agregarTarea(tarea.idnotificacion, tarea.fechaejecute, () => {
      console.log("prueba de tareas ");
    });
  });
}
