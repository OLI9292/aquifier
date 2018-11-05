import styled from 'styled-components';
import { color, media } from '../../Library/Styles/index';

export const Container = styled.div`
  height: 90vh;
  position: absolute;
  top: 0;
  width: 100%;
  background-color: white;
`

export const Main = styled.div`
  flex: auto;
  margin-right: 25px;
  position: relative;
  ${media.phone`
    margin: 0;
  `};
`

export const Content = styled.div`
  width: 100%;
  background-color: white;
  border-radius: 20px;
  z-index: 5;
  min-height: 60vh;
  ${media.phone`
    border-radius: 0px;
    margin-top: 10px;
  `};      
`

export const Header = styled.p`
  text-align: center;
  font-size: 1.5em;
  height: 0px;
  line-height: 0px;
`

export const Icon = styled.img`
  height: 30px;
  width: auto;
`

export const LeaderboardListItem = styled.li`
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: start;
`

export const ProgressListItem = styled.li`
  height: 80px;
  text-align: center
`

export const Sidebar = styled.div`
  width: 250px;
  display: flex;
  flex-direction: column;
  ${media.phone`
    display: none;
  `};  
`

export const SidebarContainer = styled.div`
  background-color: white;
  border-radius: 20px;
  padding: 10px;
  box-sizing: border-box;
`

export const Stat = styled.p`
  margin-left: ${props => props.forLeaderboards ? '5px' : '0'};
  line-height: ${props => props.forLeaderboards ? '' : '0px'};
  font-family: EBGaramondSemiBold;
  color: ${props => props.color};
  font-size: ${props => props.forLeaderboards ? '1.75em' : '1.5em'};
  margin-top: ${props => props.forLeaderboards ? '' : '20px'};
`

export const StatName = styled.div`
  height: 0px;
  line-height: 0px;
  font-size: 0.65em;
  font-family: BrandonGrotesqueBold;
  color: ${color.gray};
  letter-spacing: 1px;
  padding: 2px 0px;
`

export const Tab = styled.div`
  flex: 1;
  font-size: 1.3em;
  text-transform: capitalize;
  cursor: pointer;
  height: 60px;
  line-height: 60px;
  text-align: center;
  border-bottom: 6px solid ${props => props.selected ? color.warmYellow : color.lightGray};
  box-sizing: border-box;
  color: ${props => props.selected ? color.warmYellow : color.lightGray};
  cursor: pointer;
  font-family: BrandonGrotesque;
  margin: ${props => props.margin};
`

export const TabContainer = styled.div`
  box-sizing: border-box;
  padding: 0px 1px;
  display: flex;
  justify-content: space-between;
  width: 100%;
  background-color: white;
`

export const MiniProgressMobileContainer = styled.div`
  display: none;
  ${media.phone`
    display: block;
  `};    
`
