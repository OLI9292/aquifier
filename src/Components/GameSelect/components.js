import styled from 'styled-components';
import { color, media } from '../../Library/Styles/index';

export const Container = styled.div`
  display: flex;
  padding-top: 40px;
`

export const Content = styled.div`
  width: 100%;
  background-color: white;
  border-radius: 20px;
  z-index: 5;
  min-height: 60vh;
  ${media.phone`
    margin-top: 10px;
  `};      
`

export const GrayLine = styled.div`
  position: absolute;
  width: 100%;
  height: 10px;
  background-color: white;
  border-top: 2px solid ${color.lightestGray};
  ${media.phone`
    border: 0;
  `};  
`

export const Header = styled.p`
  text-align: center;
  font-size: 1.5em;
  height: 15px;
`

export const Icon = styled.img`
  height: 35px;
  width: auto;
`

export const LeaderboardListItem = styled.li`
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: start;
`

export const Main = styled.div`
  flex: 2.5;
  margin-right: 25px;
  position: relative;
  ${media.phone`
    margin-right: 0;
  `};
`

export const ProgressListItem = styled.li`
  height: 100px;
  text-align: center
`

export const Sidebar = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  ${media.phone`
    display: none;
  `};`

export const SidebarContainer = styled.div`
  background-color: white;
  margin-bottom: 25px;
  border-radius: 20px;
  padding-bottom: 25px;
`

export const Stat = styled.p`
  margin-left: ${props => props.forLeaderboards ? '10px' : '0'};
  line-height: ${props => props.forLeaderboards ? '' : '0px'};
  font-family: EBGaramondSemiBold;
  color: ${props => props.color};
  font-size: ${props => props.forLeaderboards ? '2em' : '1.75em'};
  margin-top: ${props => props.forLeaderboards ? '' : '20px'};
`

export const StatName = styled.div`
  height: 0px;
  line-height: 0px;
  font-size: 0.7em;
  font-family: BrandonGrotesqueBold;
  color: ${color.gray};
  letter-spacing: 1px;
  margin-top: -2px;
`

export const Tab = styled.div`
  flex: 1;
  font-size: 0.9em;
  cursor: pointer;
  height: 50px;
  line-height: 42px;
  text-align: center;
  background-color: ${props => props.selected ? color.red : color.lightBlue};
  color: white;
  border-radius: 10px;
  font-family: BrandonGrotesqueBold;
  margin: ${props => props.margin};
  ${media.phone`
    background-color: ${props => props.selected ? color.red : color.lightGray};
    color: ${props => color[props.selected ? 'white' : 'gray']};
  `};  
`

export const TabContainer = styled.div`
  box-sizing: border-box;
  padding: 0px 1px;
  position: absolute;
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: -40px;
  ${media.phone`
    margin-top: -30px;
  `};    
`

export const MiniProgressMobileContainer = styled.div`
  display: none;
  ${media.phone`
    display: block;
  `};    
`
