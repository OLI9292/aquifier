import styled from 'styled-components';
import { color, media } from '../../../Library/Styles/index';
import Header from '../../Common/header';

export const Container = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  text-align: center;
  background-color: ${props => props.userWon ? "#3DB1FE" : "white"};
  height: 90%;
  ${media.phone`
    font-size: 0.85em;
  `};    
`

export const BattleStatusHeader = styled.h1`
  text-transform: uppercase;
  font-size: 4em;
  letter-spacing: 5px;
  color: white;
  height: 30%;
  display: flex;
  color: ${props => props.userWon ? "white" : "#4E4E4E"};
  align-items: center;
  justify-content: center;
`

export const UserUpdateContainer = styled.div`
  display: flex;
  color: white;
  align-items: center;
  justify-content: center;
  font-size: 1.4em;
`

export const TopContainer = styled.div`
  margin: 0px 150px;
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
  font-family: BrandonGrotesqueBold;
  border-radius: 0px 0px 20px 20px;
  color: ${color.gray2};
  font-size: 1.2em;
  width: 425px;
  ${media.phone`
    width: 100%;
    border-radius: 0;
  `};   
`

export const LeaderboardText = styled.div`
  display: flex;
  align-items: center;
  padding-left: 75px;
  background-color: ${color.lightestGray};
  ${media.phone`
    margin: 0 0 0 -10px;
    padding: 0;
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
  margin: 20px 0px 60px 0px;
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
  font-family: BrandonGrotesque;
  font-size: 2em;
  color: ${props => props.userWon ? "white" : "#3DB1FE"};
`

export const WordCell = styled.td`
  letter-spacing: 1px;
  font-size: 1.2em;
  fontFamily: BrandonGrotesque;
  width: 150px;
  color: ${props => props.userWon ? "white" : "#3DB1FE"};
`

export const StarImage = styled.img`
  height: 18px;
  width: auto;
  margin-right: 5px;
  vertical-align: sub;
  ${media.phone`
    height: 16px;
    margin-right: 4px;
  `};    
`

export const Button = styled.div`
  cursor: pointer;
  color: ${props => props.userWon ? "white" : "#3DB1FE"};
  text-transform: uppercase;
  height: 100px;
  line-height: 100px;
  letter-spacing: 2px;
  font-size: 1.1em;
`

export const NavigationContainer = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  text-align: center;
`
