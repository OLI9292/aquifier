import styled from 'styled-components';
import { color, media } from '../../../Library/Styles/index';

export const ImageContainer = styled.div`
  height: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  display: ${props => props.hide && "none"}
`

export const Citation = styled.span`
  font-size: 0.9em;
  margin-top: 10px;
  color: ${color.gray2};
  text-align: right;
  display: block;
`

export const Arrow = styled.img`
  transform: ${props => props.down && 'scale(1, -1)'};
  margin-top: ${props => props.down && '15px'};
  pointer-events: ${props => props.interactable ? 'auto': 'none'};
  cursor: ${props => props.interactable && 'pointer'};
  height: 40px;
  width: 40px;
  box-shadow: 0 0 10px rgba(0,0,0,0.25);
  border-radius: 50%;
`

export const Container = styled.div`
  text-align: center;
  height: 100%;
  width: 100%;
`

export const FactoidContainer = styled.div`
  display: ${props => props.hide ? "none" : !props.mobile && "flex"};
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
  height: ${props => !props.mobile && "80%"};
  width: 100%;
  text-align: ${props => props.mobile && "center"};
`

export const FactoidTextContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const FactoidText = styled.p`
  font-size: 1.5em;
  text-align: left;
  padding-left: ${props => !props.mobile && "5%"};
  margin: ${props => props.mobile && `${props.hasImage ? 0 : "15px"} 5% 75px 5%`};
`
