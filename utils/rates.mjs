import axios from 'axios';

const cache = {};

export const getRate = async (date, base, target) => {
  const cacheKey = `${date},${base},${target}`;
  // return from cache
  if (cache[cacheKey]) {
    return cache[cacheKey];
  }

  let result;
  try {
    result = await axios.get(`https://api.exchangerate.host/${date}?base=${base}&symbols=${target}`);
    if (!result.data.success) {
      throw new Error('failed to get rate');
    }
  } catch (e) {
    console.error(`error getting rate`, e);
    throw e;
  }

  const rate = result.data.rates[target];

  // store in cache
  cache[cacheKey] = rate;

  return rate;
}
