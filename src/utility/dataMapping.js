import { object } from "yup/lib/locale"

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
    const timeline = sortedArray.map((keyValuePair) => {
        return keyValuePair[0];
    })
    const prices = sortedArray.map(keyValuePair2 => {
        return keyValuePair2[1]["5. adjusted close"];
    })
    let numPrices = parse(prices);
    return {timeline, numPrices};
}


const parse = (array) => {
    let numArray = []
    for (let i=0; i<array.length; i++) {
        let num = parseFloat(array[i]); // WTFUCK is toFixed not working here - either it comverts to float or fixes the length not both
        numArray.push(num);
    }
    return numArray;
};

export default dataMapping;