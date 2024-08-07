import { excelDateToMilliseconds } from "./timeConverters.js";

export default function dataExtractor(parsedData) {
  const startIndex = parsedData.findIndex((elem, i) => {
    if (elem.__EMPTY_13) {
      if (elem.__EMPTY_13.toString().includes("Факт")) {
        return i;
      }
    }
  });

  const endIndex = parsedData.findIndex((elem, i) => {
    if (elem.__EMPTY_1) {
      if (elem.__EMPTY_1.toString().includes("Итого")) {
        return i;
      }
    }
  });

  const dataRows = parsedData.slice(startIndex + 1, endIndex);

  return dataRows.map((elem) => {
    return {
      operationCount: elem['Сетевой график "Глубина-день"'],
      operationName: elem.__EMPTY,
      operationDescription: elem.__EMPTY_1,
      plan: {
        depth: elem.__EMPTY_6,
        time: elem.__EMPTY_7,
        date: excelDateToMilliseconds(elem.__EMPTY_8),
      },
      fact: {
        depth: elem.__EMPTY_9,
        time: elem.__EMPTY_10,
        date: excelDateToMilliseconds(elem.__EMPTY_13),
      },
    };
  });
}
