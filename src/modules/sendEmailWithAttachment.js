import nodemailer from "nodemailer";

// Функция для отправки email с вложением
export async function sendEmailWithAttachment(filePath, originalFilename) {
  let transporter = nodemailer.createTransport({
    host: "smtp.mail.ru",
    port: 465,
    secure: true, // true для портов 465, false для портов 587
    auth: {
      user: "work_test_tomilin@mail.ru", // Ваш email на Mail.ru
      pass: "FrBuQm6KwWBz24Tejiab", // Ваш пароль
    },
  });

  let mailOptions = {
    from: "work_test_tomilin@mail.ru",
    to: "zsn@rigintelpro.ru",
    subject: "Загруженный файл",
    text: "Пожалуйста, найдите вложенный файл.",
    attachments: [
      {
        filename: originalFilename,
        path: filePath,
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email отправлен успешно");
  } catch (error) {
    console.error("Ошибка отправки email:", error);
  }
}
