import { getRate } from './utils/rates.mjs';

export const processCsvRow = async (data) => {
  const id = data['Internal id'];
  const date = data[' Date and time'];
  const transactionType = data[' Transaction type'];
  const coinType = data[' Coin type'];
  const coinAmount = data[' Coin amount'];
  const usdValue = data[' USD Value'];
  const originalRewardCoin = data[' Original Reward Coin'];
  const rewardAmountInOriginalCoin = data[' Reward Amount In Original Coin'];
  const confirmed = data[' Confirmed'];

  console.log(`date value is ${date}`);

  const dateObj = new Date(date);
  const year = dateObj.getFullYear().toString();
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const day = dateObj.getDate().toString().padStart(2, '0');

  const rate = await getRate(`${year}-${month}-${day}`, 'USD', 'CAD');

  console.log(`rate: ${rate}`);

  const cadValue = parseFloat(usdValue) * rate;

  console.log(`cad value: ${cadValue}`);

  return {
    id,
    date,
    transactionType,
    coinType,
    coinAmount,
    usdValue,
    originalRewardCoin,
    rewardAmountInOriginalCoin,
    confirmed,
    cadValue
  }
};

export const displayData = () => {
  const transactions2021 = data.filter(d => d.date.getFullYear() === 2021)
  const report2021 = generateReport(transactions2021)
  console.log(report2021)
}

const accumulatorFunction = (field) => (acc, cur) => acc += parseFloat(cur[field]);
const accumulateUSD = accumulatorFunction('usdValue');
const accumulateCAD = accumulatorFunction('cadValue');

export const generateReport = (data) => {
  const report = {};
  ['usdc', 'btc', 'eth', 'ada'].forEach(type => {
    report[type] = {
      transferInUSD: data.filter(d => d.transactionType === 'Transfer').filter(d => d.coinType === type.toUpperCase()).reduce(accumulateUSD, 0),
      transferInCAD: data.filter(d => d.transactionType === 'Transfer').filter(d => d.coinType === type.toUpperCase()).reduce(accumulateCAD, 0),
      rewardInUSD: data.filter(d => ['Reward', 'Promo Code Reward', 'Referred Award'].includes(d.transactionType)).filter(d => d.coinType === type.toUpperCase()).reduce(accumulateUSD, 0),
      rewardInCAD: data.filter(d => ['Reward', 'Promo Code Reward', 'Referred Award'].includes(d.transactionType)).filter(d => d.coinType === type.toUpperCase()).reduce(accumulateCAD, 0)
    }
  });
  report['total'] = Object.entries(report).reduce((acc, [key, value]) => {
    return {
      transferInUSD: acc.transferInUSD + parseFloat(value.transferInUSD),
      transferInCAD: acc.transferInCAD + parseFloat(value.transferInCAD),
      rewardInUSD: acc.rewardInUSD + parseFloat(value.rewardInUSD),
      rewardInCAD: acc.rewardInCAD + parseFloat(value.rewardInCAD),
    }
  }, {
    transferInUSD: 0,
    transferInCAD: 0,
    rewardInUSD: 0,
    rewardInCAD: 0,
  })
  return report
}