
const investmentMath = (buyPrice, sellPrice) => {
    let roi = ((sellPrice - buyPrice) / buyPrice) * 100;
    let profit = sellPrice - buyPrice;

    return {roi, profit}
}

export default investmentMath;