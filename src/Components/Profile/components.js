import styled from 'styled-components';
import { color, media } from '../../Library/Styles/index';

export const HeaderStats = styled.div`
  display: flex;
  align-items: center;
  height: 200px;
  width: 50%;
  margin: 0 auto;
  margin-top: 20px;
  margin-bottom: 20px;
  justify-content: space-evenly;
  ${media.phone`
    width: 100%;
    height: 100px;
  `};      
`

export const BookStats = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  top: 0;
  width: 100%;
  height: 80%;
  margin-top: 25%;
`

export const BookContainer = styled.div`
  ${media.phone`
    display: none;
  `};     
`

export const Definition = styled.p`
  margin-left: 50px;
  text-align: left;
  font-family: EBGaramond;
  color: ${color.darkGray};
  ${media.phone`
    margin-left: 20px;
  `};    
`

export const LeftRowContent = styled.div`
  margin-left: 50px;
  text-align: left;
  line-height: 0px;
  ${media.phone`
    margin-left: 20px;
  `};    
`

export const DefinitionRow = styled.td`
  width: 40%;
  ${media.phone`
    width: 70%;
  `};   
`

export const BlankRow = styled.td`
  width: 35%;
  ${media.phone`
    width: 5%;
  `};   
`

export const StarImage = styled.img`
  height: 12px;
  width: auto;
  margin-right: 4px;
  ${media.phone`
    height: 8px;
    margin-right: 2px;
  `};    
`
