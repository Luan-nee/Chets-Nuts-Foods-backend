export class Validator {
  static isValidUsername = (val: string) => /^[a-zA-Z0-9\-_]+$/.test(val);

  static isValidPassword = (val: string) =>
    /^[a-zA-Z0-9$%&*_@#+\-_]+$/.test(val);

  static isOnlyNumbers = (val: string) => /^\d+$/.test(val);

  static isOnlyNumbersLetters = (val: string) =>
    /^[0-9a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+$/.test(val);

  static isOnlyLettersSpaces = (val: string) =>
    /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+( [a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+)*$/.test(val);

  static isValidGeneralName = (val: string) =>
    /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\-_]+( [a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\-_]+)*$/.test(
      val,
    );

  static isValidAddress = (val: string) =>
    /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\-_.,]+( [a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\-_.,]+)*$/.test(
      val,
    );

  static isValidDescription = (val: string) =>
    /^[a-zA-Z0-9áéíóúñüÁÉÍÓÚÑÜ.,¡!¿?\-()[\]{}$%&*'_"@#+:]+(\s[a-zA-Z0-9áéíóúñüÁÉÍÓÚÑÜ.,¡!¿?\-()[\]{}$%&*'_"@#+:]+)*$/.test(
      val,
    );

  static isValidFullName = (val: string) =>
    /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?: [A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/.test(val);

  static isValidPhoneNumber = (val: string) =>
    /^\+? ?[\d]+(?:[- ][\d]+)*$/.test(val);

  static containsIvalidCharacters = (val: string) => /[\\/:*?"<>|]/.test(val);
}
