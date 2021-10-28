
const investmentMath = (buyPrice, sellPrice) => {
    let percentage = ((sellPrice - buyPrice) / buyPrice) * 100;
    let roi = Math.round(percentage * 100)/100;
    let profit = sellPrice - buyPrice;

    return {roi, profit}
}

export default investmentMath;