import styled from 'styled-components';
import { color } from '../../../Library/Styles/index';

export const Img = styled.img`
  opacity: ${props => props.opaque ? 0.25 : 1};
  position: absolute;
  max-height: 65%;
  max-width: 65%;
  width: auto;
  height: auto;
`

export const InfoIconContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;
  margin-top: -5px;
  margin-right: -5px;
  height: ${props => props.large ? '35px' : '25px'};
  width: ${props => props.large ? '35px' : '25px'};
  font-size: ${props => props.large ? '0.9em' : '0.8em'};
  border-radius: 20px;
  transition: 100ms;
  font-family: BrandonGrotesqueBold;
  background-color: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
`

export const InfoIcon = styled.img`
  width: ${props => props.large ? '16px' : '13px'};
  height: auto;
`

export const LevelButton = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  height: ${props => `${props.small ? 70 : 100}px`};
  width: ${props => `${props.small ? 70 : 100}px`};
  border-radius: 60px;
  margin: 0 auto;
  border: ${props => `4px solid ${color[props.bColor]}`};
  cursor: ${props => props.isLocked ? 'default' : 'pointer'};
  transition: 100ms;
  box-sizing: border-box
`

export const StageDetail = styled.div`
  opacity: ${props => props.show ? 1 : 0};
  color: ${color.green};
  transition: opacity 100ms;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  margin-top: -5px;
  padding-bottom: 10px;
`

export const StagesContainer = styled.div`
  height: ${props => props.height};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

export const RadialProgressContainer = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
`
