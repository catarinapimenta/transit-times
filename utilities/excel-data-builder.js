const blackListedKeys = require('../configurations/black-list-keys.json');

const EXPORTED_KEY = 'transit_time_seconds';
const EXPORTED_KEY_UNIT = 'seconds';

const transportsData = [];

function getAllowedKeys(target){
    return Object.keys(target).filter(
        key => !blackListedKeys.includes(key)
    );
};

exports.storeExcelData = (destiny = {}, transport = {}, data = {} ) => {
    transportsData.push({
        capitalCity: destiny.capital, 
        type: transport.type, 
        data, 
    });
};

exports.createExcelInput = () => transportsData.map(transportData => { 
    return {
        capitalCity: transportData.capitalCity,
        type: transportData.type,
        ...getAllowedKeys(transportData.data).reduce(
            (currentTransportationData, currentKey) => { 
                return { 
                    ...currentTransportationData, 
                    [`${currentKey}_${EXPORTED_KEY_UNIT}`]: transportData.data[currentKey][EXPORTED_KEY] 
                }
            },
        {}),
    }
});

/**
 * To be more dynamic, it will be needed to get all the distinct keys
 */
exports.getColumns = (excelInput = []) => {
    return Array.from(excelInput.reduce((currentKeys, transportData) => {
        getAllowedKeys(transportData).forEach(
            dataKey => { currentKeys.add(dataKey); }
        );

        return currentKeys;
    }, new Set()));
}
