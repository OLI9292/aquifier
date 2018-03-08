import styled from 'styled-components';
import { color, media } from '../../Library/Styles/index';

export const NavContainer = styled.div`
  width: 100%;
  top: 0;
  border-radius: 20px 20px 0px 0px;
  background-color: ${color.mainBlue};
  box-sizing: border-box;
  text-align: left;
  padding-left: 5%;
`

export const Nav = styled.div`
  display: flex;
`

export const NavLink = styled.p`
  text-transform: capitalize;
  margin-right: 10px;
  font-family: BrandonGrotesque;
  font-size: 1.2em;
  cursor: pointer;
  margin-bottom: 0px;
  background-color: ${props => props.selected ? 'white' : ''};
  padding: 5px 10px 5px 10px;
  border-radius: 5px 5px 0px 0px;  
`

export const Text = styled.p`
  font-family: BrandonGrotesque;
  font-size: 1.4em;
  text-align: ${props => props.center ? 'center' : 'left'};
`

export const ContentContainer = styled.div`
  width: 90%;
  margin: 0 auto;
`

export const ProfilesContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  margin-top: 50px;
  font-size: 1.2em;
`

export const ProfileImage = styled.img`
  height: 120px;
  width: auto;
`

export const LinksContainer = styled.div`
  width: 90%;
  margin: 0 auto;
  margin-top: 50px;
  font-size: 1.2em;
  text-align: left;
`

