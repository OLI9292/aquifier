import _ from 'underscore';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { color } from '../../Library/Styles/index';
import { Container } from '../Common/container';
import Header from '../Common/header';
import data from './data';

import {
  ContentContainer,
  LinksContainer,
  NavContainer,
  Nav,
  NavLink,
  ProfilesContainer,
  ProfileImage,
  Text
} from './components';

class About extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: window.location.pathname.replace('/','')
    };
  }

  render() {
    const link = type => {
      const selected = type === this.state.type;
      return <NavLink selected={selected}>
        <Link to={'/' + type} style={{color:selected ? 'black' : 'white',textDecoration:'none'}}>
          {type}
        </Link>
      </NavLink>
    }

    const profile = data => {
      return <div style={{marginBottom:'30px'}}>
        <ProfileImage
          src={require('../../Library/Images/Headshots/' + data.imageSrc + '.png')} />
        <p style={{height:'10px',lineHeight:'10px'}}>
          {data.name}
        </p>
        <p style={{fontFamily:'BrandonGrotesque',color:color.gray2,lineHeight:'10px'}}>
          {data.title}
        </p>        
      </div>
    }

    const study = data => {
      return <div style={{marginBottom:'60px'}}>
        <p>
          <Link target={'_blank'} to={data.url} style={{color:color.blue,textDecoration:'none'}}>
            {data.name}
          </Link>
        </p>
        <p style={{fontFamily:'BrandonGrotesque',lineHeight:'0px'}}>
          {data.by}
        </p>        
      </div>      
    }

    const primaryContent = (() => {
      if (this.state.type === 'team') {
        return <ContentContainer>
          {_.map(data[this.state.type].content, block => <Text>{block}</Text>)}
          <ProfilesContainer>
            {_.map(data[this.state.type].people, profile)}
          </ProfilesContainer>
        </ContentContainer>
      } else if (this.state.type === 'research') {
        return <ContentContainer>
          {_.map(data[this.state.type].content, block => <Text>{block}</Text>)}
          <LinksContainer>
            {_.map(data[this.state.type].studies, study)}
          </LinksContainer>
        </ContentContainer>
      } else {
        return <ContentContainer>
          <Text center>Do you need help? Please email
            <a href={'mailto:support@playwordcraft.com'}
              style={{color:color.blue,textDecoration:'none'}}> support@playwordcraft.com
            </a>
          </Text>
          <Text center>For other inquiries, contact
            <a href={'mailto:hello@playwordcraft.com'}
              style={{color:color.blue,textDecoration:'none'}}> hello@playwordcraft.com
            </a>
          </Text>
        </ContentContainer>
      }
    })();

    return (
      <Container style={{paddingTop:'0'}}>
        <NavContainer>
          <Header.extraLarge thin noUpcase style={{color:'white',height:'25px',paddingTop:'30px'}}>
            About Wordcraft
          </Header.extraLarge>
          <Nav>
            {_.map(_.keys(data), link)}
          </Nav>
        </NavContainer>
        <Header.extraLarge thin noUpcase>
          {data[this.state.type].heading}
        </Header.extraLarge>
        {primaryContent}
      </Container>
    );
  }
}


export default About;
