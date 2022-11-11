const ExcelJS = require('exceljs');

const workbook = new ExcelJS.Workbook();
const worksheet = workbook.addWorksheet('Results');

worksheet.columns = [
    { header: 'City capital', key: 'cityCapital' },
    { header: 'Transport mode', key: 'transportMode' }
];

exports.generateExcel();





exports.workbook = workbook;
