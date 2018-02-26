import styled from 'styled-components';
import { color, media } from '../../Library/Styles/index';

export const Container = styled.div`
  width: 100%;
  background-color: white;
  border-radius: 20px;
  min-height: 70vh;
  text-align: center;
  font-family: BrandonGrotesqueBold;
  padding-bottom: 20px;
  position: relative;
  ${media.phone`
    font-size: 0.9em;
  `};    
`

export const Header = styled.div`
  line-height: 80px;
  text-transform: uppercase;
  width: 220px;
  border-radius: 20px;
  letter-spacing: 2px;
  margin: 0 auto;
  background-color: ${color.limeGreen};
  color: ${color.darkLimeGreen};
  font-size: 1.5em;
  position: relative;
  margin-bottom: 30px;
`

export const Cover = styled.div`
  width: 100%;
  height: 30px;
  top: -8px;
  position: absolute;
  background-color: ${color.limeGreen};
`

export const Triangle = styled.div`
  width: 0;
  height: 0;
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
  border-right: 6px solid #29A85C;
  transform: rotate(${props => props.left ? 225 : -45}deg);
  position: absolute;
  top: -8px;
  left: ${props => props.left ? '-5px' : ''};
  right: ${props => props.left ? '' : '-5px'};
`

export const Text = styled.p`
  color: ${props => props.color};
  letter-spacing: 2px;
  font-size: ${props => props.size};
  text-transform: uppercase;
  margin: 0;
  margin-top: ${props => props.accessCode ? '-10px' : ''};
`

export const StartGameButton = styled.div`
  width: 220px;
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
  margin-bottom: 35px;
`

export const TimerContainer = styled.div`
  width: 70px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${color.gray};
  font-size: 1.1em;
`
