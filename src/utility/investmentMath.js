
const investmentMath = (buyPrice, sellPrice) => {
    // let resolvedPrice = () => return Promise.resolve(sellPrice);
    console.log('SellPrice: ', sellPrice)
    let percentage = ((sellPrice - buyPrice) / buyPrice) * 100;
    console.log("percentage: ", percentage)
    return percentage.toFixed(2);
}

export default investmentMath;