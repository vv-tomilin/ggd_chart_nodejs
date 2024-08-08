import sqlite3 from "better-sqlite3";

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

// Функция для записи данных в базу данных
export default function saveDataToDatabase(filename, data) {
  try {
    const stmt = db.prepare("INSERT INTO files (filename, data) VALUES (?, ?)");
    stmt.run(filename, JSON.stringify(data));
    console.log("Данные успешно сохранены в базу данных");
  } catch (error) {
    console.error("Ошибка записи в базу данных:", error);
  }
}
