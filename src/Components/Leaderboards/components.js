import styled from 'styled-components';
import Button from '../Common/button';
import { color, media } from '../../Library/Styles/index';

export const Header = styled.h1`
  font-size: 1.5em;
  font-family: BrandonGrotesqueBold;
  letter-spacing: 2px;  
  line-height: 45px;
  text-transform: uppercase;
  padding-top: 20px;
`

export const DropdownContainer = styled.div`
  display: flex;
  width: 300px;
  margin: 0 auto;
  justify-content: space-between;
  left: 50%;
  transform: translateX(-50%);
  position: absolute;
  top: 100px;
  ${media.phone`
    top: 110px;
    width: 275px;
  `};   
`

export const LoadMoreButton = Button.small.extend`
  display: ${props => props.hide ? 'none' : 'inline-block'};
  margin: 0 auto;
  margin-top: 10px;
  margin-bottom: 20px;
  background-color: ${props => props.loadingMore ? color.green : color.blue};
`

export const Rank = styled.h3`
  background-color: ${props => props.isUser ? color.green : color.blue};
  border-radius: 5px;
  color: white;
  height: 50px;
  line-height: 50px;
  margin: 0 auto;
  width: 50px;
`

export const Row = styled.tr`
  background-color: ${props => props.even ? color.lightestGray : 'white'};
  height: 70px;
  border-radius: 20px;
`

export const TableContainer = styled.div`
  border-collapse: separate;
  border-spacing: 0 1em;
  border: 5px solid ${color.lightestGray};
  border-radius: 5px;
  font-size: 1.25em;
  margin: 0 auto;
  margin-top: 120px;
  width: 80%;
`
