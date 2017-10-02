import React, { Component } from 'react';
import { Redirect } from 'react-router';
import styled from 'styled-components';

import ActionButton from '../Buttons/action';
import MobilePopup from '../MobilePopup/index';
import Buttons from '../Buttons/default';
import DaisyChainAnimation from '../DaisyChainAnimation/index';
import InfoForm from '../InfoForm/index';
import { color } from '../../Library/Styles/index';
import logo from '../../Library/Images/logo.png';
import appleLogo from '../../Library/Images/apple-logo.png';
import androidLogo from '../../Library/Images/android-logo.png';
import { mobilecheck } from '../../Library/helpers';

const IOSURL = "https://bit.ly/playwordcraft";

class Home extends Component {
  constructor(props) {
    super(props);
    
    const isMobile = mobilecheck();
    
    this.state = {
      displayMobilePopup: false,
      redirect: null,
      isMobile: isMobile,
      iosIdx: 0
    };
  }

  removeMobilePopup() {
    this.setState({ displayMobilePopup: false });
  }

  redirect(location) {
    if (this.state.isMobile) {
      this.setState({ displayMobilePopup: true });
    } else {
      this.setState({ redirect: location });
    }
  }

  render() {
    if (this.state.redirect) {
      return <Redirect push to={this.state.redirect} />;
    }

    const introSection = () => {
      return <TopLeftContainer>
        <Subtitle>
          Master the Greek and Latin roots of English.
        </Subtitle>
        <Explanation>
          Wordcraft teaches you the building blocks of English so you expand your vocabulary much faster than memorizing long lists of words.
        </Explanation>
        <ButtonsContainer>
          <Button marginRight color={color.red} colorHover={color.red10l}>
            <Link href={IOSURL} target='blank'>
              <LinkContent><AppleLogo src={appleLogo} /><LinkText>iOS</LinkText></LinkContent>
            </Link>
          </Button>
          <Button marginRight onClick={() => this.redirect('/settings')}
            color={color.orange} 
            colorHover={color.orange10l}>Demo</Button>
          <Button onClick={() => this.redirect('/lobby')}
            color={color.green}
            colorHover={color.green10l}>Classroom Spelling Bee</Button>
        </ButtonsContainer>
      </TopLeftContainer>
    }

    const howItWorksSection = () => {
      return <Container>
        <Header color={color.blue}>
          HOW IT WORKS
        </Header>
        <ScreenshotContainer>
          <Screenshot src={require(`../../Library/Images/example.png`)} />
        </ScreenshotContainer>
        <TextContainer>
          <Text><BlackSpan><b>60% of English</b></BlackSpan> words have Greek or Latin roots.  In the fields of science and technology, that number is <BlackSpan><b>above 90%.</b></BlackSpan><br /><br />By solving fast-paced puzzles, you'll learn hundreds of roots and thousands of words.  Wordcraft is the most fun and efficient way to amass a large vocabulary.</Text>
          <Button color={color.red} colorHover={color.red10l}>
            <Link href={IOSURL} target='blank'>
              <LinkContent><AppleLogo src={appleLogo} /><LinkText>Play</LinkText></LinkContent>
            </Link>
          </Button>
        </TextContainer>
      </Container>
    }

    const masterATopicSection = () => {
      return <Container>
        <Header color={color.red}>
          MASTER A TOPIC
        </Header>
        <TextContainer>
          <Text style={{textAlign: 'right'}}>Whether you're <BlackSpan><b>preparing for a test, studying a subject</b></BlackSpan> in school or just want to <BlackSpan><b>increase your knowledge</b></BlackSpan>, <GoldSpan><b>WORDCRAFT</b></GoldSpan> makes your studying more effective.<br /><br />Pick the <BlackSpan><b>SAT / ACT, GRE, or IELTS / TOEFL</b></BlackSpan> track to learn thousands of words from each test.<br /><br />Or learn the core vocabulary from subject like <BlackSpan><b>math, biology, medicine, and zoology.</b></BlackSpan></Text>
        </TextContainer>
        <ScreenshotContainer>
          <Screenshot src={require(`../../Library/Images/categories.png`)} />
        </ScreenshotContainer>
      </Container>      
    }

    const spellingBeeSection = () => {
      return <Container>
        <Header color={color.orange}>
          SPELLING BEE
        </Header>
        <ScreenshotContainer>
          <Screenshot src={require(`../../Library/Images/results.png`)} />
        </ScreenshotContainer>
        <TextContainer>
          <Text>Use <GoldSpan><b>WORDCRAFT</b></GoldSpan>'s spelling bee mode to quickly set up a fast-paced vocabulary game for your class.  Any number of players can join on their own computers.<br /><br />Click here for a full tutorial on in-class games.</Text>
          <Button onClick={() => this.redirect('/lobby')} 
            color={color.green} 
            colorHover={color.green10l}>Play Spelling Bee!</Button>
        </TextContainer>
      </Container>   
    }

    const bringToYourClassroomForm = () => {
      return <Container>
        <Header color={color.green}>
          BRING TO YOUR CLASSROOM
        </Header>
        <InfoForm />
      </Container>
    }

    return (
      <OuterContainer>
        <Header backgroundColor={'white'} color={color.yellow}>
          WORDCRAFT
        </Header>
          {this.state.displayMobilePopup && <MobilePopup removeSelf={this.removeMobilePopup.bind(this)} />}
          <TopNav>
            <NavLink onClick={() => window.scrollTo({ top: 2800, left: 0, behavior: 'smooth'})}
              color={color.green}>For Schools</NavLink>
            <NavLink color={color.red}>
              <a style={{color: 'inherit', textDecoration: 'inherit'}} href='mailto:playwordcraft@gmail.com'>
                Support
              </a>
            </NavLink>
          </TopNav>
        <InnerContainer>
          {introSection()}
          <DaisyChainContainer>
            <DaisyChainAnimation />
          </DaisyChainContainer>
          {howItWorksSection()}
          {masterATopicSection()}
          {spellingBeeSection()}
          {bringToYourClassroomForm()}
        </InnerContainer>
      </OuterContainer>
    );
  }
}

const OuterContainer = styled.div`
  width: 100%;
  background-color: ${color.blue};
  padding-bottom: 80px;
`

const InnerContainer = styled.div`
  width: 1100px;
  margin: auto;
`

const Header = styled.h1`
  color: ${props => props.color};
  background-color: ${props => props.backgroundColor || 'transparent'};
  paddingTop: 25px;
  padding-left: 5%;
  font-size: 2.75em;
  letter-spacing: 2px;
  margin-bottom: 0px;
  height: 50px;
  line-height: 40px;
  padding-bottom: 10px;
`

const TopNav = styled.div`
  position: absolute;
  top: 15px;
  right: 0;
`

const NavLink = styled.p`
  color: ${props => props.color};
  display: inline-block;
  font-size: 1.5em;
  margin-right: 30px;
  cursor: pointer;
`

// Top Section

const TopLeftContainer = styled.div`
  vertical-align: top;
  margin-top: 25px;
  height: 425px;
  border-radius: 10px;
  background-color: white;
  width: 55%;
  display: inline-block;
`

const DaisyChainContainer = styled.div`
  margin-left: 5%;
  margin-top: 25px;
  width: 40%;
  height: 425px;
  display: inline-block;
`

const Subtitle = styled.p`
  font-size: 2em;
  margin-left: 5%;
  width: 90%;
  letter-spacing: 1px;
  color: ${color.darkGray};
  line-height: 50px;
`

const Explanation = styled.p`
  color: ${color.gray};
  font-size: 1.25em;
  width: 90%;
  margin-left: 5%;
  line-height: 35px;
`

const ButtonsContainer = styled.div`
  margin-top: 20px;
  margin-left: 5%;
  margin-bottom: 20px;
`

const Button = Buttons.small.extend`
  vertical-align: top;
  margin-right: ${props => props.marginRight ? '10px' : '0px'};
  background-color: ${props => props.color};
  width: 250px;
  height: 60px;
  &:hover {
    background-color: ${props => props.colorHover};
  }
  margin-top: 10px;
`

const LinkContent = styled.div`
  width: 90%;
  height: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Link = styled.a`
  color: inherit;
  width: 100%;
  height: 100%;
  text-decoration: none;
`

const LinkText = styled.p`
  display: table-cell;
  vertical-align: middle;
`

const BlackSpan = styled.span`
  color: black;
`

const GoldSpan = styled.span`
  color: ${color.yellow};
`

const AppleLogo = styled.img`
  height: 75%;
  margin-right: 5%;
  width: auto;
`

// Other Section Components

const Container = styled.div`
  width: 100%;
  margin: auto;
  margin-top: 40px;
  padding-top: 15px;
  border-radius: 10px;
  height: 700px;
  background-color: white;
`

const ScreenshotContainer = styled.div`
  display: inline-block;
  width: 40%;
  height: 70%;
  text-align: center;
  margin: 0% 5% 0% 5%;
  margin-top: 35px;
`

const Screenshot = styled.img`
  height: 100%;
  width: auto;
  border: 2px solid ${color.yellow};
`

const TextContainer = styled.div`
  display: inline-block;
  width: 35%;
  margin-left: 7.5%;
  vertical-align: top;
  text-align: center;
`

const Text = styled.p`
  line-height: 40px;
  text-align: left;
  font-size: 1.5em;
  color: ${color.darkGray};
`

export default Home;
