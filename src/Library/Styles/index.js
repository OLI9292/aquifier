import { css } from 'styled-components'

// TODO: change 10l, there might exist a method to do this?
export const color = {
  mainBlue: '#3F81E6',
  lightBlue: '#72CAF1',
  blue: '#4B9AEC',
  blue10l: '#438cee',
  green: '#32B368',
  green10l: '#48b978',
  yellow: '#f3be5b',
  warmYellow: '#FFC31A',
  yellow10l: '#f4c46b',
  black: '#000000',
  black10l: '#191919',
  red: '#FD7274',
  red10l: '#FF7171',
  darkGray: '#686868',
  mediumGray: '#BDBEC0',
  gray2: '#58595B',
  gray: '#828282',
  gray10l: '#8e8e8e',
  lightestGray: '#F2F2F2',
  lightGray: '#d9d9d9',
  gold: '#C98910',
  silver: '#A8A8A8',
  bronze: '#965A38',
  orange: '#FD7F38',
  orange10l: '#FF9952',
  purple: '#9b51e0',
  purple10l: '#a562e3',
  googleRed: '#DC4C3D',
  googleRed10l: '#df5d50',
  facebookBlue: '#4862A3',
  facebookBlue10l: '#5a71ac',
  white: '#ffffff',
  paleBlue: '#D3EFFB',
  honey: '#BF430C'
};

export const PHONE_MAX_WIDTH = 600

export const media = {
  phone: (...args) => css`
    @media (max-width: ${PHONE_MAX_WIDTH}px) {
      ${ css(...args) }
    }
  `
}