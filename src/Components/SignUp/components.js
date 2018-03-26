import styled from 'styled-components';
import { color, media } from '../../Library/Styles/index';


export const InputTitle = styled.p`
  position: absolute;
  top: -16px;
  font-family: BrandonGrotesqueBold;
  color: ${color.mainBlue};
  margin: 0;
  font-size: 0.6em;
  letter-spacing: 1px;  
  text-transform: uppercase;
  left: 5px;
`

export const Container = styled.div`
  position: absolute;
  background-color: white;
  left: 50%;
  top: 50%;
  width: 500px;
  min-height: 350px;
  margin-left: -250px;
  margin-top: -250px;
  border-radius: 10px;
  z-index: 100;
`

export const StepsContainer = styled.div`
  width: 250px;
  margin: 0 auto;
  display: ${props => props.hide ? 'none' : 'flex'};
  justify-content: space-between;
  align-items: center;
  padding-top: 40px;
  ${media.phone`
    padding-top: 50px;
    width: 275px;
    font-size: 0.8em;
  `};     
`

export const Step = styled.div`
  font-family: BrandonGrotesqueBold;
  border: ${props => props.selected ? `5px solid ${color.green}` : `1px solid ${color.mediumLGray}`};
  color: ${props => props.selected ? color.green : color.mediumLGray};
  border-radius: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  margin: 0 auto;
  ${media.phone`
    width: 30px;
    height: 30px;
    border: ${props => props.selected ? `3px solid ${color.green}` : `1px solid ${color.mediumLGray}`};
  `};  
`

export const BackArrow = styled.img`
  position: absolute;
  display: ${props => props.hide ? 'none' : ''};
  height: 50px;
  width: auto;
  top: 10px;
  left: 20px;
  cursor: pointer;
  ${media.phone`
    top: 20px;
    height: 35px;
  `};    
`

export const TableContainer = styled.div`
  width: 90%;
  max-height: 250px;
  margin: 0 auto;
  overflow: auto;
  margin-top: 40px;
`

export const StudentsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  border-radius: 10px;
  background-color: ${color.lightestGray};
`

export const StudentCountCell = styled.td`
  background-color: ${color.darkBabyBlue};
  height: 35px;
  color: white;
  padding-left: 20px;
  text-align: left;
  font-family: BrandonGrotesqueBold;
  font-size: 0.9em;
  border-radius: 10px 10px 0px 0px;
`

export const StudentCell = styled.td`
  height: 50px;
  padding-left: 20px;
  text-align: left;
  font-size: 1.2em;
  color: ${color.gray2};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 15px;
  text-transform: capitalize;
`

export const ImportStudentListContainer = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
`

export const ImportInformationContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  background-color: ${color.darkBabyBlue};
  color: white;
  border-radius: 10px 10px 0px 0px;
  font-family: BrandonGrotesqueBold;
  font-size: 0.85em;
  padding: 20px 15px;
  box-sizing: border-box;
`
