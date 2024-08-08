import express from "express";

import uploadFile from "./modules/uploadFile.js";
import fileParser from "./modules/fileParser.js";
import dataExtractor from "./utils/dataExtractor.js";
import saveDataToDatabase from "./modules/saveDataToDatabase.js";
import { sendEmailWithAttachment } from "./modules/sendEmailWithAttachment.js";

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
  await sendEmailWithAttachment(filePath);

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
