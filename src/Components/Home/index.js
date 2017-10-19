import React, { Component } from 'react';
import { Redirect } from 'react-router';
import styled from 'styled-components';
import _ from 'underscore';

import ActionButton from '../Buttons/action';
import MobilePopup from '../MobilePopup/index';
import Buttons from '../Buttons/default';
import DaisyChainAnimation from '../DaisyChainAnimation/index';
import InfoForm from '../InfoForm/index';
import HelpText from '../HelpText/index';
import Login from '../Login/index';
import EmailLogin from '../Login/emailLogin';
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
    const userId = localStorage.getItem('userId');

    this.state = {
      displayMobilePopup: false,
      displayLogin: false,
      redirect: null,
      isMobile: isMobile,
      isSmallScreen: false,
      iosIdx: 0,
      loggedIn: !_.isNull(userId),
      isTeacher: false
    };
  }

  checkWindowSize() {
    const isSmallScreen = window.innerWidth <= 1100
    this.setState({ isSmallScreen });
  }

  componentDidMount() {
    this.checkWindowSize();
    window.addEventListener('resize', this.checkWindowSize.bind(this));
    const userId = localStorage.getItem('userId');
    const classId = localStorage.getItem('classId');
    this.setState({ userId: userId, isTeacher: !_.isNull(classId) })
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.checkWindowSize.bind(this));
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

  showHelpText() {
    this.setState({ showHelpText: true });
  }

  hideHelpText() {
    this.setState({ showHelpText: false });
  }

  exitLogin() {
    const userId = localStorage.getItem('userId');
    const classId = localStorage.getItem('classId');
    this.setState({
      displayLogin: false,
      displayEmailLogin: false,
      loggedIn: !_.isNull(userId),
      userId: userId,
      isTeacher: !_.isNull(classId)
    });
  }

  displayEmailLogin() {
    this.setState({ displayEmailLogin: true });
  }

  handleBackgroundClick() {
    this.setState({ displayLogin: false, displayEmailLogin: false });
  }

  handleLoginLogout() {
    if (this.state.loggedIn) {
      localStorage.clear('userId');
      localStorage.clear('username');
      this.setState({ loggedIn: false });
    } else {
      this.setState({ displayLogin: true });
    }
  }

  render() {
    if (this.state.redirect) {
      return <Redirect push to={this.state.redirect} />;
    }

    const login = () => {
      if (this.state.displayEmailLogin) {
        return <EmailLogin exit={this.exitLogin.bind(this)}/>
      } else if (this.state.displayLogin) {
        return <Login displayEmailLogin={this.displayEmailLogin.bind(this)} exit={this.exitLogin.bind(this)} />
      }
    }

    const navigation = () => {
      return <Nav>
        <NavContent>
          <Header style={{display: 'inline-block'}} backgroundColor={'white'} color={color.yellow}>
            WORDCRAFT
          </Header>
          <NavLinks style={{right: 0}}>
            <NavLink display onClick={() => window.scrollTo({ top: 2875, left: 0, behavior: 'smooth'})}
              color={color.green} colorHover={color.green10l}>For Schools</NavLink>
            <NavLink onClick={() => this.redirect(this.state.isTeacher ? '/dashboard' : `/profile/${this.state.userId}`)}
              display={this.state.loggedIn}
              color={color.orange}
              colorHover={color.orange10l}>
              {this.state.isTeacher ? 'My Class' : 'My Progress'}
            </NavLink>
            <NavLink display color={color.red} colorHover={color.red10l}>
              <a style={{color: 'inherit', textDecoration: 'inherit'}} href='mailto:support@gmail.com'>
                Support
              </a>
            </NavLink>
            <NavLink display color={color.blue} colorHover={color.blue10l} onClick={() => this.handleLoginLogout()}>
              {this.state.loggedIn ? 'Logout' : 'Login'}
            </NavLink>
          </NavLinks>
        </NavContent>
      </Nav>
    }

    const introSection = () => {
      return <TopLeftContainer>
        <Subtitle>
          Master the Greek and Latin roots of English.
        </Subtitle>
        {this.state.isSmallScreen && <DaisyChainAnimation />}
        <Explanation>
          Expand your vocabulary without memorizing long lists of words. Prepare for a test, specialize in a topic, or just learn the entire dictionary.
        </Explanation>
        <ButtonsContainer>
          <Button marginRight color={color.red} colorHover={color.red10l}>
            <Link href={IOSURL} target='blank'>
              <LinkContent><AppleLogo src={appleLogo} /><LinkText>iOS</LinkText></LinkContent>
            </Link>
          </Button>
          <Button marginRight onClick={() => this.redirect('/settings')}
            color={color.blue}
            colorHover={color.blue10l}>Demo</Button>
          <Button onClick={() => this.redirect('/lobby')}
            color={color.green}
            colorHover={color.green10l}>Classroom Spelling Bee</Button>
        </ButtonsContainer>
      </TopLeftContainer>
    }

    const howItWorksSection = () => {
      return <Container>
        <Header padLeft color={color.blue}>
          HOW IT WORKS
        </Header>
        <ScreenshotContainer>
          <Screenshot src={require('../../Library/Images/example.png')} />
        </ScreenshotContainer>
        <TextContainer>
          <Text><BlackSpan><b>60% of English words</b></BlackSpan> have Greek or Latin roots.  In the fields of science and technology, that number is <BlackSpan><b>above 90%.</b></BlackSpan><br /><br />By solving fast-paced puzzles, you will learn hundreds of roots and thousands of words.  Wordcraft is the most fun and efficient way to acquire a large vocabulary.</Text>
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
        <Header padLeft color={color.red}>
          MASTER A TOPIC
        </Header>
        <TextContainer>
          <Text style={{textAlign: 'right'}}>Whether you are <BlackSpan><b>preparing for a test, studying a subject</b></BlackSpan> in school or just want to <BlackSpan><b>increase your knowledge</b></BlackSpan>, <GoldSpan><b>WORDCRAFT</b></GoldSpan> makes your studying more effective.<br /><br />Pick the <BlackSpan><b>SAT / ACT, GRE, or IELTS / TOEFL</b></BlackSpan> track to learn thousands of words from each test.<br /><br />Or learn the core vocabulary of subjects like <BlackSpan><b>math, biology, medicine, and zoology.</b></BlackSpan></Text>
        </TextContainer>
        <ScreenshotContainer>
          <Screenshot src={require(`../../Library/Images/categories.png`)} />
        </ScreenshotContainer>
      </Container>
    }

    const spellingBeeSection = () => {
      return <Container>
        <Header padLeft color={color.orange}>
          SPELLING BEE
        </Header>
        <ScreenshotContainer>
          <Screenshot src={require(`../../Library/Images/results.png`)} />
        </ScreenshotContainer>
        <TextContainer>
          <Text>Use <GoldSpan><b>WORDCRAFT</b></GoldSpan> spelling bee mode to quickly set up a fast-paced vocabulary game for your class.  Any number of players can join on their own computers.<br /><br />Click <BlackSpan onMouseOver={this.showHelpText.bind(this)} onMouseLeave={this.hideHelpText.bind(this)}><b>here</b></BlackSpan> for a full tutorial on in-class games.</Text>
          <Button onClick={() => this.redirect('/lobby')}
            color={color.green}
            colorHover={color.green10l}>
            Play Spelling Bee!</Button>
        </TextContainer>
      </Container>
    }
    const bringToYourClassroomForm = () => {
      return <Container>
        <Header padLeft color={color.green}>
          BRING TO YOUR CLASSROOM
        </Header>
        <InfoForm />
      </Container>
    }
    return (
      <OuterContainer>
        {this.state.showHelpText && <HelpTextContainer><HelpText type={'classroomTutorial'} /></HelpTextContainer>}
        {this.state.displayMobilePopup && <MobilePopup removeSelf={this.removeMobilePopup.bind(this)} />}
        {login()}
        <DarkBackground display={this.state.displayLogin} onClick={() => this.handleBackgroundClick()} />
        {navigation()}
        <InnerContainer>
          {introSection()}
          {!this.state.isSmallScreen && <DaisyChainContainer> <DaisyChainAnimation /> </DaisyChainContainer>}
          {howItWorksSection()}
          {masterATopicSection()}
          {spellingBeeSection()}
          {bringToYourClassroomForm()}
        </InnerContainer>
      </OuterContainer>
    );
  }
}
const DarkBackground = styled.div`
  display: ${props => props.display ? '' : 'none'};
  z-index: 5;
  background-color: rgb(0, 0, 0);
  opacity: 0.7;
  -moz-opacity: 0.7;
  filter: alpha(opacity=70);
  height: 100%;
  width: 100%;
  background-repeat: repeat;
  position: fixed;
  top: 0px;
  left: 0px;
`
const HelpTextContainer = styled.div`
  position: fixed;
  left: 30%;
  margin-left: -300px;
  line-height: 35px;
  top: 40%;
  width: 600px;
  @media (max-width: 1100px) {
    background-color: white;
    width: 65%;
    margin-left: 0;
  }
`
const OuterContainer = styled.div`
  width: 100%;
  background-color: ${color.blue};
  padding-bottom: 80px;
  @media (max-width: 1100px) {
    background-color: white;
    padding-bottom: 40px;
  }
`
const InnerContainer = styled.div`
  width: 1100px;
  margin: auto;
  @media (max-width: 1100px) {
    text-align: center;
    width: 90%;
    min-width: 300px;
  }
`
const Header = styled.h1`
  color: ${props => props.color};
  background-color: ${props => props.backgroundColor || 'transparent'};
  paddingTop: 25px;
  padding-left: ${props => props.padLeft ? '5%' : '0%'};
  font-size: 2.75em;
  letter-spacing: 2px;
  margin-bottom: 0px;
  line-height: 50px;
  padding-bottom: 10px;
  @media (max-width: 1100px) {
    font-size: 2em;
  }
  @media (max-width: 450px) {
    font-size: 1.25em;
  }
`
const Nav = styled.div`
  width: 100%;
  background-color: white;
  padding-bottom: 10px;
`
const NavContent = styled.div`
  width: 1100px;
  margin: auto;
  @media (max-width: 1100px) {
    width: 90%;
    min-width: 300px;
  }
`
const NavLinks = styled.div`
  display: inline-block;
  float: right;
  padding-top: 25px;
  line-height: 10px;
  @media (max-width: 1100px) {
    padding-top: 15px;
  }
`
const NavLink = styled.p`
  color: ${props => props.color};
  display: ${props => props.display ? 'inline-block' : 'none'};
  font-size: 1.5em;
  margin-left: 30px;
  cursor: pointer;
  text-align: right;
  &:hover {
    color: ${props => props.colorHover};
  }
  @media (max-width: 1100px) {
    margin-left: 15px;
  }
  @media (max-width: 725px) {
    font-size: 1.2em;
  }
  @media (max-width: 400px) {
    font-size: 0.9em;
  }
  `
// Top Section
const TopLeftContainer = styled.div`
  vertical-align: top;
  margin-top: 40px;
  height: 450px;
  border-radius: 10px;
  background-color: white;
  width: 55%;
  display: inline-block;
  @media (max-width: 1100px) {
    margin-top: 20px;
    display: block;
    width: 100%;
    height: fit-content;
  }
`

const DaisyChainContainer = styled.div`
  margin-left: 5%;
  margin-top: 40px;
  width: 40%;
  height: 450px;
  display: inline-block;
  @media (max-width: 1100px) {
    display: none;
  }
`
const Subtitle = styled.p`
  font-size: 2em;
  margin-left: 5%;
  width: 90%;
  letter-spacing: 1px;
  color: ${color.darkGray};
  line-height: 50px;
  @media (max-width: 1100px) {
    font-size: 1.75em;
    line-height: 40px;
    margin-bottom: 0px;
  }
  @media (max-width: 450px) {
    font-size: 1.25em;
    line-height: 30px;
  }
`
const Explanation = styled.p`
  color: ${color.darkGray};
  font-size: 1.25em;
  width: 90%;
  margin-left: 5%;
  line-height: 35px;
  @media (max-width: 1100px) {
    font-size: 1.2em;
    line-height: 30px;
  }
  @media (max-width: 450px) {
    font-size: 0.9em;
    line-height: 25px;
  }
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
  @media (max-width: 1100px) {
    height: 50px;
    width: 200px;
    font-size: 1.2em;
  }
  @media (max-width: 450px) {
    font-size: 0.9em;
    height: 45px;
    width: 175px;
  }
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
  @media (max-width: 1100px) {
    height: fit-content;
    margin-top: 15px;
  }
  @media (max-width: 450px) {
    margin-top: 10px;
    height: fit-content;
  }
`
const ScreenshotContainer = styled.div`
  display: inline-block;
  width: 40%;
  height: 70%;
  text-align: center;
  margin: 0% 5% 0% 5%;
  margin-top: 35px;
  @media (max-width: 1100px) {
    width: 50%;
    max-width: 300px;
    display: block;
    margin: auto;
  }
`
const Screenshot = styled.img`
  height: 100%;
  width: auto;
  @media (max-width: 1100px) {
    height: auto;
    width: 100%;
  }
`
const TextContainer = styled.div`
  display: inline-block;
  width: 35%;
  margin-left: 7.5%;
  vertical-align: top;
  text-align: center;
  @media (max-width: 1100px) {
    width: 90%;
  }
`
const Text = styled.p`
  line-height: 40px;
  text-align: left;
  font-size: 1.5em;
  color: ${color.darkGray};
  @media (max-width: 1100px) {
    line-height: 30px;
    text-align: left !important;
    font-size: 1.2em;
  }
  @media (max-width: 450px) {
    font-size: 0.9em;
  }
`
export default Home;
