import styled, { keyframes } from 'styled-components';
import { color, media } from '../../../Library/Styles/index';

export const Text = styled.p`
  letter-spacing: 2px;
  text-transform: uppercase;
  font-family: BrandonGrotesqueBold;
  color: ${props => props.color};
  height: 80px;
  line-height: 80px;
  vertical-align: top;
  margin: 0;
  margin-left: 20px;
  display: inline-block;
`

const dashoffset = keyframes`
  to {
    stroke-dashoffset: 0;
  }
`;

export const Circle = styled.circle`
  fill: white;
  stroke: ${props => props.strokeColor};
  stroke-width: 6;
  stroke-dasharray: 250;
  stroke-dashoffset: 1000;
  animation: ${props => props.animate ? `${dashoffset} 5s linear infinite` : ''};
`

export const ArenaContainer = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-top: -40px;
  ${media.phone`
    padding: 0;
    min-height: 80vh;
  `}; 
`

export const ModalContainer = styled.div`
  position: absolute;
  top: 0;
  background-color: white;
  width: 100%;
  height: 100%;
  text-align: center;
`

export const Friend = styled.div`
  width: 300px;
  height: 60px;
  border: 1px solid ${color.gray};
  border-radius: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 20px;
  box-sizing: border-box;
  margin: 0 auto;  
  cursor: pointer;
`

export const PlayerContainer = Friend

export const OnlineIndicator = styled.div`
  height: 14px;
  width: 14px;
  background-color: ${props => props.isOnline ? color.green : color.gray};
  border-radius: 50%;
`
