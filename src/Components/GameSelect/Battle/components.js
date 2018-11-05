import React from 'react';
import styled, { keyframes } from 'styled-components';
import { color, media } from '../../../Library/Styles/index';

export const versus = visibility => <svg height={"50"} width={"50"} visibility={visibility}>
  <g>
    <circle fill={color.red} cx={"25"} cy={"25"} r={"20"}>
      <p>
        vs
      </p>
    </circle>
    <text x="50%" y="50%" textAnchor="middle" stroke={"white"} strokeWidth="1px" dy=".3em">
      vs
    </text>    
  </g>
</svg>;

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

export const searching = <svg height="40" width="40" style={{display:"inline-block"}}>
  <Circle 
    animate={true}
    strokeColor={color.warmYellow} 
    cx="20" cy="20" r="15">
  </Circle>
</svg>;

export const ArenaContainer = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  text-align: center;
  display: flex;
  align-items: center;
  flex-direction: column;
  ${media.phone`
    padding: 0;
    min-height: 80vh;
  `}; 
`

export const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
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
  margin-top: 15px;
  cursor: pointer;
`

export const PlayerContainer = Friend

export const OnlineIndicator = styled.div`
  height: 14px;
  width: 14px;
  background-color: ${props => props.isOnline ? color.green : color.gray};
  border-radius: 50%;
`
