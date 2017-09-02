export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const toArr = (elem) => {
  return Array.isArray(elem) ? elem : [elem];
}
