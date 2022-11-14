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

const converter = (worksheet = {}) => {
    return {
        toJson(){
            const keys = worksheet.rows[0].cells.map(cell => cell.value);

            const json = worksheet.rows.slice(1)
                .map(row => row.cells)
                .map(cells => cells.reduce(
                    (mappedCells, cell, index) => { return { ...mappedCells, [keys[index]] : cell.value } }
                , {}))

            return json;
        },
    }
}

exports.dataModelFromXLSXFile = async (filePath = '', worksheet = 0) => {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);

    return converter(workbook.model.worksheets[worksheet]);
};
