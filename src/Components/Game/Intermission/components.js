import styled from 'styled-components';
import { color, media } from '../../../Library/Styles/index';
import Header from '../../Common/header';

export const ExitImg = styled.img`
  cursor: pointer;
  height: 40px;
  width: 40px;
  ${media.phone`
    height: 35px;
    width: 35px;
  `};   
`

export const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  text-align: center;
  ${media.phone`
    font-size: 0.85em;
  `};    
`

export const TopContainer = styled.div`
  margin: 0px 50px;
  display: flex;
  justify-content: space-between;
  ${media.phone`
    width: 100%;
    margin: 0;
    display: inline-block;
  `};  
`

export const LevelProgressContainer = styled.div`
  width: 250px;
  height: 150px;
  text-align: center;
  margin-top: 25px !important;
  ${media.phone`
    width: 225px;
    height: 100px;
    margin: 0 auto;
    display: flex;    
  `};    
`

export const LevelProgressHeader = Header.small.extend`
  color: black;
  ${media.phone`
    text-align: left;
    margin-left: 20px; 
  `};    
`

export const CircularProgressbarContainer = styled.div`
  width: 100px;
  height: 100px;
  margin-left: 75px;
  ${media.phone`
    margin: 0;
  `};   
`

export const LeaderboardProgressContainer = styled.div`
  background-color: ${color.lightestGray};
  font-family: BrandonGrotesqueBold;
  border-radius: 0px 0px 20px 20px;
  color: ${color.gray2};
  font-size: 1.2em;
  width: 425px;
  height: 175px;
  ${media.phone`
    height: 125px;
    width: 100%;
    border-radius: 0;
  `};   
`

export const LeaderboardText = styled.div`
  display: flex;
  align-items: center;
  margin-left: 75px;
  ${media.phone`
    margin: 0 0 0 -10px;
    height: 50px;
    justify-content: center;
  `};   
`

export const CTA = styled.p`
  font-size: 0.8em;
  color: white;
  width: 100%;
  text-align: center;
  height: 50px;
  margin: 0;
  background-color: ${color.blue};
  border-radius: 0px 0px 20px 20px;
  line-height: 50px;
  ${media.phone`
    border-radius: 0;
  `};   
`

export const TablesContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin: 30px 0px 60px 0px;
  ${media.phone`
    width: 90%;
    margin: 0 auto;
    display: inline-block;
    margin-top: 30px;
  `};   
`

export const Table = styled.table`
  text-align: left;
  ${media.phone`
    margin: 0 auto;
    margin-bottom: 30px;
  `};  
`

export const TableHeader = styled.p`
  letter-spacing: 1px;
  font-family: BrandonGrotesqueBold;
  font-size: 1.2em;
  color: ${color.mainBlue};
`

export const WordCell = styled.td`
  letter-spacing: 1px;
  fontFamily: BrandonGrotesque;
  width: 125px;
`

export const StarImage = styled.img`
  height: 12px;
  width: auto;
  margin-right: 4px;
  ${media.phone`
    height: 11px;
    margin-right: 3px;
  `};    
`

export const Button = styled.div`
  width: 200px;
  margin: 0 auto;
  background-color: ${color.warmYellow};
  height: 55px;
  line-height: 55px;
  border-radius: 30px;
  cursor: pointer;
  color: ${color.brown};
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: 1.1em;
  text-align: center;
  font-family: BrandonGrotesqueBold;
`
