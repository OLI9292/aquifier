import styled from 'styled-components';
import { color } from '../../Library/Styles/index';

export const Row = styled.tr`
  background-color: ${props => props.holistic
    ? color.mainBlue
    : props.hover 
      ? color.paleBlue
      : props.dark ? color.lightestGray : 'white'
  };
  cursor: pointer;
`

export const Table = styled.table`
  width: 100%;
  margin: auto;
  border-collapse: collapse;
  text-align: center;
  cursor: pointer;
`

export const TableCell = styled.td`
  height: 75px;
  width: 20%;
  border-left: ${props => props.border ? `5px solid ${color.mainBlue}` : ''};
  border-right: ${props => props.border ? `5px solid ${color.mainBlue}` : ''};
  color: ${props => props.holistic ? 'white' : color.gray2};
  font-family: ${props => props.header ? 'BrandonGrotesqueBold' : 'BrandonGrotesque'};
  font-size: ${props => props.header ? '1em' : '1.2em'};
  position: relative;
  background-color: ${props => props.green ? color.limeGreen : ''};  
`

export const Arrow = styled.img`
  width: ${props => props.small ? '17px' : '20px'};
  height: ${props => props.small ? '17px' : '20px'};
  margin-left: ${props => props.small ? '10px' : '0'};
  transform: ${props => props.ascending ? 'scale(-1, 1)' : 'scale(1, -1)'};
  visibility: ${props => props.hide ? 'hidden' : 'visible'};
`

export const FlexContainer = styled.div`
  height: 100%;
  display: flex; 
  justify-content: center;
  align-items: center;
`

export const Dropdown = styled.ul`
  position: absolute;
  left: 0;
  margin: 0;
  width: 100%;
  padding: 0;  
  z-index: 100;
`

export const DropdownItem = styled.li`
  height: 40px;
  list-style-type: none;
  width: 100%;
  margin: 0;
  line-height: 40px;
  padding: 0;
  font-family: BrandonGrotesque;
  color: ${props => props.hover ? 'white' : color.extraDarkLimeGreen};
  background-color: ${props => props.hover ? color.darkLimeGreen : color.limeGreen};
`