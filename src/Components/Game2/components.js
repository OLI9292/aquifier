import styled from 'styled-components';

import { color, media, PHONE_MAX_WIDTH } from '../../Library/Styles/index';

export const Alert = styled.div`
  position: absolute;
  right: 40px;
  top: 10px;
  height: 50px;
  display: flex;
  align-items: center;
  transition: 0.2s;
  opacity: ${props => props.hide ? 0 : 1};
`

export const StageDot = styled.div`
  width: 15px;
  height: 7px;
  background-color: ${props => props.green ? color.green : color.lightGray};
  border-radius: 4px;
  display: inline-block;
  margin-right: 5px;
`

export const HelpButton = styled.div`
  width: 120px;
  height: 50px;
  background-color: ${props => props.color};
  color: white;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0,0,0,0.25);
  z-index: 9999;
  cursor: pointer;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;  
`

export const Content = styled.div`
  height: 100vh;
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  position: relative;
  opacity: ${props => props.opacity};
  transition: opacity 200ms;
  ${media.phone`
    font-size: 0.7em;
  `}  
`

export const ExitOut = styled.img`
  position: absolute;
  height: 40px;
  width: auto;
  top: 10px;
  cursor: pointer;
`

export const ButtonValue = styled.p`
  font-size: 2em;
  color: white;
  display: table-cell;
  vertical-align: middle;
  text-transform: uppercase;
`

export const Bottom = styled.div`
  height: 10%;
  width: 90%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const PromptContainer = styled.div`
  height: 25%;
  width: 80%;
  margin: 0 auto;
  text-align: center;
  position: relative;
`

export const Prompt = styled.div`
  position: absolute; 
  display: table;
  width: 100%;
  height: 100%;
`

export const PromptValue = styled.p`
  display: table-cell;
  vertical-align: middle;
  text-align: center;
  font-size: 1.75em;
`

export const Answer = styled.div`
  height: 25%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const AnswerSpace = styled.div`
  width: ${props => props.width};  
  margin: ${props => props.margin};
  transition: margin 200ms;
`

export const Underline = styled.div`
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background-color: ${props => props.color};
  width: ${props => props.width};
`

export const AnswerValue = styled.p`
  text-align: center;
  font-size: 2.25em;
  visibility: ${props => props.missing ? 'hidden' : 'visible'};
  text-transform: uppercase;
  height: 0px;
  line-height: 0px;
`

export const Choices = styled.div`
  height: 50%;
  width: 90%;
  margin: 0 auto;
  display: grid;
  grid-template-columns: ${props => props.grid.column};
  grid-template-rows: ${props => props.grid.row};
  align-items: center;
  justify-items: center;
  ${media.phone`
    grid-template-columns: ${props => props.mobileGrid.column};
    grid-template-rows: ${props => props.mobileGrid.row};
  `}    
`

export const ChoiceButton = styled.div`
  background-color: ${props => props.bColor};
  height: ${props => props.long ? '80%' : '100px'};
  font-size: ${props => props.long ? '0.75em' : '1em'};
  cursor: pointer;
  display: table;
  width: ${props => props.square
    ? '100px'
    : props.long
      ? '80%'
      : '250px'};
  text-align: center;
  border-radius: 20px;
  box-shadow: 0 0 10px rgba(0,0,0,0.25);
  transition-duration: 0.15s;
  ${media.phone`
    height: 60px;
    width: ${props => props.square
      ? '60px'
      : props.long
        ? '80%'
        : '150px'};    
    border-radius: 15px;
  `}
`
