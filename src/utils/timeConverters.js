export function excelDateToMilliseconds(serial) {
  // Основная дата в Excel (1 января 1900 года)
  const excelStartDate = new Date(Date.UTC(1900, 0, 1));

  // Количество дней между Excel и Unix эпохами
  const daysBetweenEpochs = (new Date(Date.UTC(1970, 0, 1)) - excelStartDate) / (1000 * 60 * 60 * 24);

  // Конвертация в миллисекунды
  const utcDays = Math.floor(serial - 25569 + daysBetweenEpochs);
  const utcValue = utcDays * 86400 * 1000; // количество миллисекунд за дни
  const dateInfo = new Date(utcValue);

  // Десятичная часть дня (время)
  const fractionalDay = serial - Math.floor(serial);
  const totalMilliseconds = Math.floor(86400 * 1000 * fractionalDay);

  return utcValue + totalMilliseconds;
}
