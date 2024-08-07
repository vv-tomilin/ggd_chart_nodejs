import multer from "multer";
import path from "path";

export default function uploadFile() {
  // Настройка Multer для сохранения загруженных файлов
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
      // Используем исходное имя файла
      const originalname = Buffer.from(file.originalname, "latin1").toString("utf8");
      const filename = `${Date.now()}_${originalname}`;
      cb(null, filename);
    },
  });

  const upload = multer({ storage });

  return upload;
}
