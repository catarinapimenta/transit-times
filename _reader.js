const Timer = require('./utilities/timer');
const ExcelBuilder = require('./utilities/excel-builder');

// external dependencies
const fs = require('fs');

// to get info that the script is running
const timer = Timer.initLoader();

const FILE_PATH = process.argv[2];

// our script
async function whenAllStarts() {
    
    const excelData = await ExcelBuilder.dataModelFromXLSXFile(FILE_PATH);

    fs.writeFileSync('./data/destinations.json', JSON.stringify(excelData.toJson(), undefined, 2));

    // stop the loader
    Timer.stopLoader(timer);
}

try {
    if(!FILE_PATH){
        Timer.stopLoader(timer);
        
        process.stdout.write('Pls, provide the file path');
        process.exit(0);
    };

    // start the program
    whenAllStarts();
} catch  {
    // stop the loader
    Timer.stopLoader(timer);
}
