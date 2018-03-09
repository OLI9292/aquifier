import styled from 'styled-components';
import { color, media } from '../../../Library/Styles/index';

export const Container = styled.div`
  padding: 20px 0px;
  position: relative;
  ${media.phone`
    padding: 0;
    min-height: 80vh;
  `}; 
`

export const BackArrow = styled.img`
  position: absolute;
  height: 75px;
  width: auto;
  top: 10px;
  left: 20px;
  cursor: pointer;
`

export const CategoryHeaderContainer = styled.div`
  height: 50px;
  background-color: ${color.lightestGray};
  width: 200px;
  position: relative;
  margin: 20px 0px 20px -8px;
  z-index: 3;
`

export const CategoryHeader = styled.p`
  line-height: 50px;
  font-family: BrandonGrotesqueBold;
  padding-left: 30px;
  font-size: 0.85em;
  color: ${props => props.color};
  letter-spacing: 1px;
`

export const Triangle = styled.div`
  width: 0;
  height: 0;
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
  border-left: 6px solid ${color.lightGray};
  transform: rotate(-45deg);
  position: absolute;
  bottom: -7px;
  left: 4px;
  z-index: 2;
`

export const Circle = styled.div`
  height: 50px;
  width: 50px;
  position: absolute;
  border-radius: 30px;
  background-color: ${color.lightestGray};
  top: 0;
  right: -25px;
`

export const ButtonsContainer = styled.div`
  width: 90%;
  margin: 0 auto;
`

export const SubcategoryContainer = styled.div`
  display: inline-block;
  margin: 0px 20px;
  text-align: center;
  width: 80px;
`

export const SubcategoryButton = styled.div`
  background-color: ${props => props.color};
  width: 80px;
  cursor: pointer;
  height: 80px;
  border-radius: 50px;
`

export const SubcategoryName = styled.p`
  font-family: BrandonGrotesqueBold;
  color: ${color.gray};
`

export const TopicIcon = styled.img`
  height: 50%;
  width: 50%;
  text-align: center;
  margin-top: 25%;
`

export const LevelSelectContainer = styled.div`
  text-align: center;
  width: 90%;
  margin: 0 auto;
`

export const LevelSelectHeader = styled.p`
  font-family: BrandonGrotesqueBold;
  font-size: 2.25em;
  color: ${props => props.color};
  letter-spacing: 1px;
  height: 20px;
  line-height: 20px;
`

export const SubcategoryDescription = styled.p`
  font-family: EBGaramond;
  width: 70%;
  margin: 0 auto;
`

export const LevelButton = styled.div`
  background-color: ${props => props.color};
  width: 80px;
  cursor: pointer;
  height: 80px;
  border-radius: 50px;
  display: inline-block;
  margin: 0px 20px;
`

export const LevelButtonText = styled.p`
  font-family: BrandonGrotesqueBold;
  font-size: 1.5em;
  color: white;
  height: 80px;
  line-height: 80px;
  margin: 0;
`

export const LevelButtonsContainer = styled.div`
  margin-top: 40px;
`
