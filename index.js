const from = require('./configurations/origin.json');
const destinations = require('./configurations/destinations.json');
const transports = require('./configurations/transports.json');
const Timer = require('./utilities/timer');
const ExcelDataBuilder = require('./utilities/excel-data-builder')

const axios = require('axios');
const fs = require('fs');

const timer = Timer.initLoader();

// our script
async function whenAllStarts() {
    const requestUrl = "http://sirius.searates.com/distance-and-time/search";
    const transportsResponses = [];

    for (const destiny of destinations) {
        for (const transport of transports) {

            // call the transit times service
            const queryTransportUrl = `type=${transport.type}&speed=${transport.avgSpeed}`;
            const queryFromUrl= `lat_from=${from.lat}&lng_from=${from.lng}&from_country_code=${from.country_code}`;
            const queryToUrl= `lat_to=${destiny.lat}&lng_to=${destiny.lng}&to_country_code=${destiny.country_code}`;
            // url to request for each destiny
            const url = `${requestUrl}?${queryTransportUrl}&${queryFromUrl}&${queryToUrl}`;
            // responses
            const response = await axios.get(url);

            transportsResponses.push({ 
                capitalCity: destiny.capital, 
                type: transport.type, 
                data: response.data 
            });
        };
    };

    const xpto = ExcelDataBuilder.createExcelInput(transportsResponses)
    // fs.writeFileSync('./results/results.json', JSON.stringify(excelData, undefined, 2));

    console.info(xpto)

    Timer.stopLoader(timer);
};

// start the program!
whenAllStarts();
