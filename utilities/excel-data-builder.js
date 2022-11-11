const blackListedKeys = require('./black-list-keys.json');

exports.createExcelInput = (transportsData = []) => transportsData.map(transportData => { 
    return {
        capitalCity: transportData.capitalCity,
        type: transportData.type,
        data: Object.keys(transportData.data)
                .filter(transportDataKey => !blackListedKeys.includes(transportDataKey))
                .reduce((currentTransportationData, currentKey) => { 
                    return { ...currentTransportationData, [currentKey]: transportData.data[currentKey] }
                }, {}),
    }
});
