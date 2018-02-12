import styled from 'styled-components';

import { color, media, PHONE_MAX_WIDTH } from '../../Library/Styles/index';

export const Container = styled.div`
  display: flex;
  padding-top: 40px;
`

export const GrayLine = styled.div`
  position: absolute;
  width: 100%;
  height: 10px;
  background-color: white;
  border-top: 2px solid ${color.lightestGray};
`

export const TabContainer = styled.div`
  box-sizing: border-box;
  padding: 0px 1px;
  position: absolute;
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: -40px;
`

export const Tab = styled.div`
  flex: 1;
  font-size: 0.9em;
  cursor: pointer;
  height: 50px;
  line-height: 42px;
  text-align: center;
  background-color: ${props => props.selected ? color.red : 'white'};
  color: ${props => props.selected ? 'white' : color.mediumGray};
  border-radius: 10px;
  font-family: BrandonGrotesqueBold;
  margin: ${props => props.margin};
`

export const Main = styled.div`
  flex: 2.5;
  margin-right: 25px;
  position: relative;
`

export const Content = styled.div`
  width: 100%;
  background-color: white;
  border-radius: 20px;
  z-index: 5;
  min-height: 60vh;
`

export const Sidebar = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`

export const SidebarContainer = styled.div`
  background-color: white;
  margin-bottom: 25px;
  border-radius: 20px;
  padding-bottom: 25px;
`

export const Header = styled.p`
  text-align: center;
  font-size: 1.5em;
  height: 15px;
`

export const LeaderboardListItem = styled.li`
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: start;
`

export const ProgressListItem = styled.li`
  height: 100px;
  text-align: center
`

export const Icon = styled.img`
  height: 35px;
  width: auto;
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

export const Stat = styled.p`
  margin-left: ${props => props.forLeaderboards ? '10px' : '0'};
  line-height: ${props => props.forLeaderboards ? '' : '0px'};
  font-family: EBGaramondSemiBold;
  color: ${props => props.color};
  font-size: ${props => props.forLeaderboards ? '2em' : '1.75em'};
  margin-top: ${props => props.forLeaderboards ? '' : '20px'};
`
