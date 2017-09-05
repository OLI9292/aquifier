export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const toArr = (elem) => {
  return Array.isArray(elem) ? elem : [elem];
}

export const toUnderscore = (str) => {
  return str.split('').map((c) => '_').join('');
}

export const isLetter = (str) => {
  return str && str.length === 1 && str.match(/[a-z]/i);
}

export const guid = () => {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}
