
const investmentMath = (buyPrice, sellPrice) => {
    // let resolvedPrice = () => return Promise.resolve(sellPrice);
    // Phase 2: solve data issue or is this needed at all??
    let percentage = ((sellPrice - buyPrice) / buyPrice) * 100;
    let roi = percentage.toFixed(2);
    let profit = sellPrice - buyPrice;

    return {roi, profit}
}

export default investmentMath;