export class SchedulerTask {
  private tareas = new Map<number, NodeJS.Timeout>();

  agregarTarea(id: number, fecha: Date, callback: () => void) {
    const restante = fecha.getTime() - Date.now();

    if (restante <= 0) {
      return;
    }

    const timeout = setTimeout(() => {
      callback();

      this.tareas.delete(id);
    }, restante);

    this.tareas.set(id, timeout);
  }

  cancelarTarea(id: number) {
    const tarea = this.tareas.get(id);

    if (tarea) {
      clearTimeout(tarea);

      this.tareas.delete(id);
    }
  }

  getTasks() {
    return [...this.tareas.keys()];
  }
}
