import express from "express";
import sqlite3 from "better-sqlite3";
import { fileURLToPath } from "url";
import { dirname } from "path";

import uploadFile from "./modules/uploadFile.js";
import fileParser from "./modules/fileParser.js";
import dataExtractor from "./utils/dataExtractor.js";
import { sendEmailWithAttachment } from "./modules/sendEmailWithAttachment.js";


// Создаем подключение к базе данных SQLite
const db = sqlite3("db/data.db");

// Создаем таблицу, если она не существует
db.exec(`
  CREATE TABLE IF NOT EXISTS files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT,
    data JSON
  )
`);

const app = express();
const port = 3005;

const upload = uploadFile();

// Middleware для установки заголовков CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("Файл не найден");
  }

  const filePath = req.file.path;
  console.log("Файл получен:", req.file);

  const originalname = Buffer.from(req.file.originalname, "latin1").toString("utf8");

  // Отправка файла на почту
  //!await sendEmailWithAttachment(filePath);

  // Отложенная обработка файла
  const data = await fileParser(filePath);
  const result = await dataExtractor(data);

  // Запись данных в SQLite
  await saveDataToDatabase(originalname, result);

  res.json(result);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Функция для записи данных в базу данных
function saveDataToDatabase(filename, data) {
  try {
    const stmt = db.prepare("INSERT INTO files (filename, data) VALUES (?, ?)");
    stmt.run(filename, JSON.stringify(data));
    console.log("Данные успешно сохранены в базу данных");
  } catch (error) {
    console.error("Ошибка записи в базу данных:", error);
  }
}
