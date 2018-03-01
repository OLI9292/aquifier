import styled from 'styled-components';
import { color, media } from '../../Library/Styles/index';

export const BackArrow = styled.img`
  position: absolute;
  display: ${props => props.hide ? 'none' : ''};
  height: 75px;
  width: auto;
  top: 10px;
  left: 20px;
  cursor: pointer;
`

export const StepsContainer = styled.div`
  width: 400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 40px;
`

export const Step = styled.div`
  position: relative;
  width: 75px;
  padding: 0px 10px;
`

export const Circle = styled.div`
  font-family: BrandonGrotesqueBold;
  font-size: 1.4em;
  width: 50px;
  border: ${props => props.selected ? `5px solid ${color.green}` : `1px solid ${color.mediumLGray}`};
  color: ${props => props.selected ? color.green : color.mediumLGray};
  border-radius: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  margin: 0 auto;
`

export const StepDescription = styled.p`
  text-transform: uppercase;
  height: 15px;
  line-height: 15px;
  color: ${color.mediumLGray};
  font-size: 0.65em;
  font-family: BrandonGrotesqueBold;
  letter-spacing: 1px;
  width: 75px;
`

export const Header = styled.h1`
  font-size: 1.5em;
  font-family: BrandonGrotesqueBold;
  letter-spacing: 3px;  
  color: ${color.green};
  line-height: 45px;
  text-transform: uppercase;
`

export const OptionsContainer = styled.div`
  width: 90%;
  margin: 0 auto;
  margin-top: 30px;
  display: ${props => props.grid ? 'grid' : ''};
  grid-template-columns: ${props => props.grid ? '1fr 1fr 1fr 1fr 1fr' : ''};  
`

export const OptionButton = styled.div`
  text-align: center;
  color: ${props => props.selected ? 'white' : color.babyBlue};
  text-transform: uppercase;
  font-family: BrandonGrotesqueBold;
  width: ${props => props.small ? '100px' : '300px'};
  height: ${props => props.small ? '40px' : '60px'};
  line-height: ${props => props.small ? '40px' : '60px'};
  margin: 0 auto;
  font-size: ${props => props.small ? '0.9em' : '1.1em'};
  letter-spacing: 1px;
  cursor: pointer;
  border-radius: 35px;
  margin-top: 15px;
  margin-bottom: 15px;
  background-color: ${props => props.selected ? color.green : color.mainBlue};
`

export const NextButton = styled.div`
  text-align: center;
  color: white;
  font-family: BrandonGrotesqueBold;
  width: 150px;
  height: 60px;
  line-height: 60px;
  margin: 0 auto;
  font-size: 1.1em;
  letter-spacing: 1px;
  display: ${props => props.hide ? 'none' : ''};
  cursor: pointer;
  border-radius: 35px;
  margin-top: 15px;
  margin-bottom: 15px;
  background-color: ${color.green};
`
