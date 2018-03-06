import styled from 'styled-components';
import { media } from '../../Library/Styles/index';

export const Container = styled.div`
  pointer-events: ${props => props.loading ? 'none' : 'auto'};
  width: 100%;
  background-color: white;
  border-radius: 20px;
  min-height: 80vh;
  text-align: center;
  padding-top: 20px;
  padding-bottom: 20px;
  font-family: BrandonGrotesqueBold;
  position: relative;
  ${media.phone`
    font-size: 0.9em;
    border-radius: 0px;
    position: absolute;
    padding-bottom: 120px;    
  `};    
`
