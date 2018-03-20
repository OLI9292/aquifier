import styled from 'styled-components';
import { color, media } from '../../Library/Styles/index';

export const Container = styled.div`
  position: absolute;
  background-color: white;
  left: 50%;
  top: 50%;
  width: 500px;
  min-height: 350px;
  margin-left: -250px;
  margin-top: -250px;
  border-radius: 10px;
  z-index: 100;
`

export const StepsContainer = styled.div`
  width: 400px;
  margin: 0 auto;
  display: ${props => props.hide ? 'none' : 'flex'};
  justify-content: space-between;
  align-items: center;
  padding-top: 40px;
  ${media.phone`
    padding-top: 50px;
    width: 275px;
    font-size: 0.8em;
  `};     
`

export const Step = styled.div`
  font-family: BrandonGrotesqueBold;
  font-size: 1.4em;
  width: 50px;
  border: ${props => props.selected ? `5px solid ${color.green}` : `1px solid ${color.mediumLGray}`};
  color: ${props => props.selected ? color.green : color.mediumLGray};
  border-radius: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  margin: 0 auto;
  ${media.phone`
    width: 30px;
    height: 30px;
    border: ${props => props.selected ? `3px solid ${color.green}` : `1px solid ${color.mediumLGray}`};
  `};  
`

export const BackArrow = styled.img`
  position: absolute;
  display: ${props => props.hide ? 'none' : ''};
  height: 75px;
  width: auto;
  top: 10px;
  left: 20px;
  cursor: pointer;
  ${media.phone`
    top: 20px;
    height: 35px;
  `};    
`
