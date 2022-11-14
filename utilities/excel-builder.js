const pt = require('../translations/pt.json')

const ExcelJS = require('exceljs');

let workbook;
let worksheet;

const FILE_EXTENSION = 'xlsx';

/**
 * Excel builder object
 */
const builder = {
    setColumns(columns = []){
        worksheet.columns = columns.map(column => { 
            return {
                header: pt[column] || column,
                key: column,
                width: 25,
            }
         });
        
        // bold header
        worksheet.getRow(1).font = { bold: true };

        return builder;
    },
    setRows(excelData = []){
        worksheet.addRows(excelData);

        return builder;
    },
    async generate(filePath){
        await workbook.xlsx.writeFile(`${filePath}.${FILE_EXTENSION}`)
    }
}

exports.build = (worksheetName = 'Results') => {
    workbook = new ExcelJS.Workbook();
    worksheet = workbook.addWorksheet(worksheetName);

    return builder;
};
