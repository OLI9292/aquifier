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

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll.bind(this), true);
  }

  handleScroll() {
    const yPos = window.pageYOffset || document.body.scrollTop;
    
    let iosIdx;

    if (yPos < 600) {
      iosIdx = 0;
    } else if (yPos < 675) {
      iosIdx = 1;
    } else {
      iosIdx = 2;
    }

    this.setState({ iosIdx });
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

    const topSection = () => {
      return <TopContainer>
        <Subtitle>
          Master the Greek and Latin roots of English.
        </Subtitle>
        <Explanation>
          Wordcraft teaches you the building blocks of English so you expand your vocabulary much faster than memorizing long lists of words.
        </Explanation>
        <div>
          <div style={{marginTop: '40px'}}>
            <Button marginRight onClick={() => this.redirect('/settings')}
              color={color.blue} 
              colorHover={color.blue10l}>Single Player</Button>
            <Button marginRight onClick={() => this.redirect('/lobby')}
              color={color.yellow} 
              colorHover={color.yellow10l}>Multiplayer</Button>
            <Button color={color.black} colorHover={color.black10l}>
              <Link href={IOSURL} target='blank'>
                <LinkContent>
                  <AppleLogo src={appleLogo} />
                  <LinkText>iOS</LinkText>
                </LinkContent>
              </Link>
            </Button>
          </div>
        </div>
      </TopContainer>
    }

    const iosCopy = [
      { header: 'Use root words to learn, not memorize', body: 'By playing games with the roots of vocabulary, your knowledge grows expansively and flexibly.' },
      { header: 'Master a Topic', body: 'Intelligently prepare for tests like the GRE, SAT/ACT, IELTS or TOEFL. Focus on subjects like math, medicine, science, or biology to gain a deeper understanding of the material.' },
      { header: 'Compete Against Friends', body: 'Play against your friends in our fast paced multiplayer version of the spelling bee.' }
    ];

    const iosSections = () => {
      return iosCopy.map((copy, i) => {
        const selected = i === this.state.iosIdx;
        return <IOSSection onClick={() => this.setState({ iosIdx: i })}>
          <IOSSectionHeader selected={selected}>{copy.header}</IOSSectionHeader>
          <IOSSectionP selected={selected}>{copy.body}</IOSSectionP>
        </IOSSection>
      });
    }

    const iosSection = () => {
      return <IOSContainer>
        <IOSSectionsContainer>
          {iosSections()}
        </IOSSectionsContainer>
        <ScreenshotContainer>
          <Screenshot src={require(`../../Library/Images/screenshot-0.png`)} />
        </ScreenshotContainer>
      </IOSContainer>
    }

    return (
      <Layout onWindowScroll={this.handleScroll}>
        {this.state.displayMobilePopup && <MobilePopup removeSelf={this.removeMobilePopup.bind(this)} />}
        <Header backgroundColor={'white'} color={color.yellow}>
          WORDCRAFT
        </Header>
        <TopNav>
          <NavLink onClick={() => window.scrollTo({ top: 1250, left: 0, behavior: 'smooth'})}
            color={color.green}>For Schools</NavLink>
          <NavLink color={color.red}>
            <a style={{color: 'inherit', textDecoration: 'inherit'}} href='mailto:playwordcraft@gmail.com'>
              Support
            </a>
          </NavLink>
        </TopNav>
        {topSection()}
        <DaisyChainContainer>
          <DaisyChainAnimation />
        </DaisyChainContainer>
        <Header backgroundColor={color.blue} color={'white'} paddingTop={'25px'}>
          HOW IT WORKS
        </Header>
        {iosSection()}
        <Header color={color.yellow}>
          BRING TO YOUR CLASSROOM
        </Header>
        <InfoForm />
      </Layout>
    );
  }
}

const Layout = styled.div`
  height: 100%;
  width: 100%;
`

const Header = styled.h1`
  color: ${props => props.color};
  background-color: ${props => props.backgroundColor};
  padding-left: 5%;
  font-size: 3em;
  letter-spacing: 2px;
  padding-top: ${props => props.paddingTop};
  margin-bottom: 0px;
  padding-bottom: 25px;
`

const TopNav = styled.div`
  position: absolute;
  top: 25px;
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

const TopContainer = styled.div`
  vertical-align: top;
  margin-left: 10%;
  width: 40%;
  height: 300px;
  margin-bottom: 100px;
  display: inline-block;
`

const Subtitle = styled.p`
  font-size: 2em;
  letter-spacing: 1px;
  color: ${color.darkGray};
  line-height: 50px;
`

const Explanation = styled.p`
  color: ${color.gray};
  font-size: 1.25em;
  line-height: 35px;
`

const Button = Buttons.small.extend`
  vertical-align: top;
  margin-right: ${props => props.marginRight ? '10px' : '0px'};
  background-color: ${props => props.color};
  &:hover {
    background-color: ${props => props.colorHover};
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

const AppleLogo = styled.img`
  height: 75%;
  margin-right: 5%;
  width: auto;
`

const DaisyChainContainer = styled.div`
  margin-left: 5%;
  width: 40%;
  height: 300px;
  display: inline-block;
`

// iOS Section

const IOSContainer = styled.div`
  width: 100%;
  height: 650px;
  background-color: ${color.blue};
`

const IOSSectionsContainer = styled.div`
  margin-left: 5%;
  width: 45%;
  vertical-align: top;
  display: inline-block;
`

const IOSSection = styled.div`
  height: 200px;
  cursor: pointer;
`

const IOSSectionHeader = styled.h2`
  color: ${props => props.selected ? color.yellow : 'white'};
`

const IOSSectionP = styled.p`
  visibility: ${props => props.selected ? 'visible' : 'hidden'};
  color: white;
  font-size: 1.25em;
`

const ScreenshotContainer = styled.div`
  display: inline-block;
  width: 40%;
  height: 500px;
  margin-left: 10%;
  padding-top: 50px;
`

const Screenshot = styled.img`
  height: 100%;
  width: auto;
  border: 2px solid ${color.yellow};
`

export default Home;
