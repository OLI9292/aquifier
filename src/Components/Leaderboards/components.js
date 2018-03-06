import styled from 'styled-components';
import Button from '../Common/button';
import { color, media } from '../../Library/Styles/index';

export const DropdownContainer = styled.div`
  display: flex;
  left: 50%;
  transform: translateX(-50%);
  position: absolute;
  top: 80px;
`

export const LoadMoreButton = Button.extraSmall.extend`
  display: ${props => props.hide ? 'none' : 'inline-block'};
  margin: 0 auto;
  margin-top: 10px;
  margin-bottom: 20px;
  background-color: ${props => props.loadingMore ? color.green : color.mainBlue};
`

export const Rank = styled.h4`
  background-color: ${props => props.isUser ? color.green : color.lightBlue};
  border-radius: 25px;
  color: white;
  height: 40px;
  line-height: 40px;
  margin: 0 auto;
  width: 40px;
`

export const Row = styled.tr`
  background-color: ${props => props.even ? color.lightestGray : 'white'};
  height: 70px;
  border-radius: 20px;
`

export const TableContainer = styled.div`
  border-collapse: separate;
  border-spacing: 0 1em;
  border: 3px solid ${color.lightestGray};
  border-radius: 20px;
  margin: 0 auto;
  margin-top: 120px;
  width: 80%;
  ${media.phone`
    width: 100%;
    border-width: 0; 
    margin-top: 100px;
  `};  
`
