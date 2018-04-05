import styled from 'styled-components';
import { color, media } from '../../Library/Styles/index';

export const Row = styled.tr`
  height: 75px;
  background-color: ${props => props.holistic
    ? color.mainBlue
    : props.dark ? color.lightestGray : 'white'
  };
  cursor: pointer;
`

export const Table = styled.table`
  width: 100%;
  margin: auto;
  border-collapse: collapse;
  text-align: center;
`

export const TableCell = styled.td`
  border-left: ${props => props.border ? `5px solid ${color.mainBlue}` : ''};
  border-right: ${props => props.border ? `5px solid ${color.mainBlue}` : ''};
  color: ${props => props.header
    ? color.gray2
    : props.holistic ? 'white' : 'black'};
  font-family: ${props => props.header ? 'BrandonGrotesqueBold' : 'BrandonGrotesque'};
  font-size: ${props => props.header ? '1em' : '1.5em'};
  text-align: ${props => props.left ? 'left' : 'center'};
  padding-left: ${props => props.left ? '7.5%' : '0'};
  padding-right: ${props => props.right ? '7.5%' : '0'};
`
