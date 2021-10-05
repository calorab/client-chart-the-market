
const dataMapping = data => {

    let sortedArray = Object.entries(data).sort((a,b) => {
        let date1 = new Date(a[0])
        let date2 = new Date(b[0])

        if (date1 < date2) {
            return -1
        } if (date1 > date2) {
            return 1
        } else {
            throw new Error("Dates should not be equal to each other")
        }
    })

    const dataTable = sortedArray.map((keyValuePair) => {
        let numPrice = parseFloat(keyValuePair[1]["5. adjusted close"]);
        return {'date': keyValuePair[0], 'price': numPrice};
    })
    
    return dataTable;
}

export default dataMapping;