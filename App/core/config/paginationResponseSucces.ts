import { paginationResponde } from "../core.js";

export const paginationResponseSuccess = (cantidad: number, pagina: number) => {
  const paginas: paginationResponde = {
    total_data: cantidad,
    datos_por_pagina: 10,
    pagina_actual: pagina,
    total_paginas: Math.trunc(cantidad / 10),
  };
  return paginas;
};
