import styled from 'styled-components';
import { color, media } from '../../Library/Styles/index';

//
// ALERT
//

export const Alert = styled.div`
  position: absolute;
  right: 40px;
  top: 10px;
  height: 50px;
  display: flex;
  align-items: center;
  transition: opacity 0.2s;
  display: ${props => props.display};
  opacity: ${props => props.hide ? 0 : 1};
  ${media.phone`
    right: 5px;
    top: 5px;
  `}     
`

export const AlertImage = styled.img`  
  height: 75%;
  width: auto;
  margin-right: 10px;
  ${media.phone`
    height: 40px;
  `} 
`

export const AlertText = styled.p`    
  font-size: 1.1em;
  color: ${props => props.color};
  ${media.phone`
    display: none;
  `}   
`

//
// ANSWER
//

export const Answer = styled.div`
  height: 25%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  ${media.phone`
    width: 80%;
    margin: 0 auto;
  `}   
`

export const AnswerSpace = styled.div`
  margin: ${props => props.margin};
  transition: margin 200ms;
`

export const AnswerValue = styled.p`
  text-align: center;
  font-size: 2.25em;
  visibility: ${props => props.missing ? 'hidden' : 'visible'};
  text-transform: uppercase;
  height: 0px;
  line-height: 0px;
`

export const Underline = styled.div`
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background-color: ${props => props.color};
  padding: 0px 2px;
`

//
// BOTTOM
//

export const Bottom = styled.div`
  height: 10%;
  width: 90%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${media.phone`
    font-size: 1.25em;
  `}   
`

//
// BUTTON
//

export const ButtonContent = styled.p`
  font-size: 2em;
  margin: 0;
  color: white;
  text-transform: uppercase;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

export const ButtonHint = styled.span`
  display: block;
  font-size: 0.75em;
  opacity: ${props => props.opacity};
  transition: opacity 200ms;  
`

export const ButtonValue = styled.span`
  display: block;
  margin-top: ${props => `${props.hintOn ? 0 : 35}px`};
  transition: margin 200ms;
`

//
// CONTENT
//

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

//
// CHOICES
//

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
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${props => props.square
    ? '100px'
    : props.long
      ? '80%'
      : '250px'};
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

//
// EXIT
//

export const ExitOut = styled.img`
  position: absolute;
  height: 40px;
  width: auto;
  top: 10px;
  cursor: pointer;
`

//
// HELP
//

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
  ${media.phone`
    width: 100px;
    height: 40px;
  `}    
`

export const HelpSpan = styled.span`
  font-size: 0.6em;
  display: ${props => props.hide ? 'block' : 'none'};
  ${media.phone`
    display: none;
  `}
`

//
// PROMPT
//

export const Prompt = styled.div`
  position: absolute; 
  display: table;
  width: 100%;
  height: 100%;
`

export const PromptContainer = styled.div`
  height: 25%;
  width: 80%;
  margin: 0 auto;
  text-align: center;
  position: relative;
`

export const PromptValue = styled.p`
  display: table-cell;
  vertical-align: middle;
  text-align: center;
  font-size: 1.75em;
`

//
// STAGE
//

export const StageDot = styled.div`
  width: 15px;
  height: 7px;
  background-color: ${props => props.green ? color.green : color.lightGray};
  border-radius: 4px;
  display: inline-block;
  margin-right: 5px;
`
