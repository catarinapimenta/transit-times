const from = require('./configurations/origin.json');

const transports = require('./configurations/transports.json');
const Timer = require('./utilities/timer');
const ExcelDataBuilder = require('./utilities/excel-data-builder');
const ExcelBuilder = require('./utilities/excel-builder');

// external dependencies
const axios = require('axios');
const fs = require('fs');

// to get info that the script is running
const timer = Timer.initLoader();
// searates api url
const BASE_REQUEST_URL = "http://sirius.searates.com/distance-and-time/search";

// create the excel file
async function buildExcel() {
    const excelData = ExcelDataBuilder.createExcelInput();
    const excelColumns = ExcelDataBuilder.getColumns(excelData);

    // todo: remove this line!
    fs.writeFileSync('./data/output.json', JSON.stringify(excelData, undefined, 2));

    await ExcelBuilder
        .build('Results')
        .setColumns(excelColumns)
        .setRows(excelData)
        .generate('./data/output');
}

// our script
async function whenAllStarts(destinations = []) {
    for (const destination of destinations) {
        for (const transport of transports) {
            // build the query to call searates service
            const queryTransportUrl = `type=${transport.type}&speed=${transport.avgSpeed}`;
            const queryFromUrl= `lat_from=${from.lat}&lng_from=${from.lng}&from_country_code=${from.country_code}`;
            const queryToUrl= `lat_to=${destination.lat}&lng_to=${destination.lng}&to_country_code=${destination.country_code}`;
            
            // url to request for each destination
            const url = `${BASE_REQUEST_URL}?${queryTransportUrl}&${queryFromUrl}&${queryToUrl}`;
            
            // searates service request responses
            const response = await axios.get(url);

            ExcelDataBuilder.storeExcelData(destination, transport, response.data);
        };
    };

    // start building excel with the provided excel data
    buildExcel();

    // stop the loader
    Timer.stopLoader(timer);
};

try {
    // destinations file path
    const destinations = process.argv[2];

    if(!destinations){
        Timer.stopLoader(timer);
        
        process.stdout.write('Pls, provide the destinations file path');
        process.exit(0);
    };

    const destinationsJsonFile = JSON.parse(fs.readFileSync(destinations));

    // start the program
    whenAllStarts(destinationsJsonFile);
} catch  {
    // stop the loader
    Timer.stopLoader(timer);
}
