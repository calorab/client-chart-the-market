
const investmentMath = (buyPrice, sellPrice) => {
    let percentage = ((sellPrice - buyPrice) / buyPrice) * 100;
    return percentage.toFixed(2);
}

export default investmentMath;