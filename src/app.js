import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import * as XLSX from "xlsx";

const app = express();
const port = 3005;

// Настройка Multer для сохранения загруженных файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Используйте исходное имя файла и добавьте его расширение
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}${ext}`;
    cb(null, filename);
  }
});

const upload = multer({ storage });

// Middleware для установки заголовков CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.get("/", (_, res) => {
  res.send("Test");
});

app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("Файл не найден");
  }

  const filePath = req.file.path;
  console.log("Файл получен:", req.file);

  // Верните ответ клиенту сразу после загрузки
  res.send("Файл успешно загружен");

  // Отложенная обработка файла
  processFile(filePath);
});

// Функция для обработки загруженного файла
const processFile = (filePath) => {
  try {
    // Чтение файла Excel в буфер
    const fileBuffer = fs.readFileSync(filePath);

    // Чтение Excel файла из буфера
    const workbook = XLSX.read(fileBuffer, { type: "buffer" });
    console.log("Имена листов:", workbook.SheetNames);

    // Перебор всех листов и вывод данных для отладки
    const jsonData = {};
    workbook.SheetNames.forEach((sheetName) => {
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
      jsonData[sheetName] = data;
      console.log(`Данные листа "${sheetName}":`, data);
    });

    // Удаление файла после обработки
    //fs.unlinkSync(filePath);

    // Обработка завершена
    console.log("Файл успешно обработан");
  } catch (error) {
    console.error("Ошибка парсинга файла:", error);
  }
};

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
