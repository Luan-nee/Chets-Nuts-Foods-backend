function convertidorLetra(caracter: string) {
  if (caracter == "1") {
    return "A";
  } else if (caracter == "2") {
    return "B";
  } else if (caracter == "3") {
    return "C";
  } else if (caracter == "4") {
    return "D";
  } else if (caracter == "5") {
    return "E";
  } else if (caracter == "6") {
    return "F";
  } else if (caracter == "7") {
    return "G";
  } else if (caracter == "8") {
    return "H";
  } else if (caracter == "9") {
    return "I";
  } else if (caracter == "0") {
    return "J";
  }
}

function convertidorNumero(caracter: string) {
  if (caracter == "A") {
    return "1";
  } else if (caracter == "B") {
    return "2";
  } else if (caracter == "C") {
    return "3";
  } else if (caracter == "D") {
    return "4";
  } else if (caracter == "E") {
    return "5";
  } else if (caracter == "F") {
    return "6";
  } else if (caracter == "G") {
    return "7";
  } else if (caracter == "H") {
    return "8";
  } else if (caracter == "I") {
    return "9";
  } else if (caracter == "J") {
    return "0";
  }
}

export function ConvertLetras(id: number) {
  const texto = id.toString();
  let codigo = "";
  for (const car of texto) {
    codigo += convertidorLetra(car);
  }
  return codigo;
}

export function convertNumeros(id: string) {
  let codigo = "";
  for (const car of id) {
    codigo += convertidorNumero(car);
  }

  const idResponse = Number(codigo);
  return idResponse;
}
