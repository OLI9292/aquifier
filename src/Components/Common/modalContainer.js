import styled from 'styled-components';
import { media } from '../../Library/Styles/index';

export const ModalContainer = styled.div`
  position: absolute;
  background-color: white;
  left: 50%;
  width: 500px;
  min-height: 350px;
  margin-left: -250px;
  top: 50px;
  border-radius: 10px;
  z-index: 100;
  ${media.phone`
    border-radius: 0;
    margin: 0;
    left: 0;
    top: 0;
    height: 100vh;
    width: 100%;
  `};   
`
