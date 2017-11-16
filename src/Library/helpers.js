import _ from 'underscore';
import { color } from './Styles/index';

export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const toArr = (elem) => {
  return Array.isArray(elem) ? elem : [elem];
}

export const toUnderscore = (str) => {
  return str ? str.split('').map((c) => '_').join('') : '';
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

export const mobilecheck = () => typeof window.orientation !== 'undefined'

export const validateEmail = (email) => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
}

export const capitalizeOne = (str) => {
  return str.charAt(0).toUpperCase().concat(str.slice(1).toLowerCase());
}

export const concat = (x, y) => x.concat(y)

export const flatMap = (f, xs) => xs.map(f).reduce(concat, [])

export const sum = (arr, attr) => _.reduce(_.pluck(arr, attr), (n, m) => n + m, 0)

export const move = (array, fromIndex, toIndex) => {
  array.splice(toIndex, 0, array.splice(fromIndex, 1)[0]);
  return array;
} 

export const lighten10 = (hex) => {
  const colors = {};
  colors[color.blue] = color.blue10l;
  colors[color.green] = color.green10l;
  colors[color.yellow] = color.yellow10l;
  colors[color.black] = color.black10l;
  colors[color.red] = color.red10l;
  colors[color.orange] = color.orange10l;
  colors[color.purple] = color.purple10l;
  colors[color.googleRed] = color.googleRed10l;
  colors[color.gray] = color.gray10l;
  colors[color.facebookBlue] = color.facebookBlue10l;
  return colors[hex];
}

export const unixTime = () => {
  return Math.round((new Date()).getTime() / 1000)
}

export const isHome = () => window.location.pathname === '/'
