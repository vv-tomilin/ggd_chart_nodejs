import fs from "fs";
import * as XLSX from "xlsx";

// Функция для обработки загруженного файла
export default function fileParser(filePath) {
  try {
    // Чтение файла Excel в буфер
    const fileBuffer = fs.readFileSync(filePath);

    // Чтение Excel файла из буфера
    const workbook = XLSX.read(fileBuffer, { type: "buffer" });
    console.log("Имена листов:", workbook.SheetNames);

    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const parsedData = XLSX.utils.sheet_to_json(sheet);

    // Удаление файла после обработки
    fs.unlinkSync(filePath);

    // Обработка завершена
    console.log("Файл успешно обработан");

    return parsedData;
  } catch (error) {
    console.error("Ошибка парсинга файла:", error);
  }
}
