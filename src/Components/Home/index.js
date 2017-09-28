import React, { Component } from 'react';
import { Redirect } from 'react-router';
import styled from 'styled-components';

import ActionButton from '../Buttons/action';
import MobilePopup from '../MobilePopup/index';
import DaisyChainAnimation from '../DaisyChainAnimation/index';
import { color } from '../../Library/Styles/index';
import logo from '../../Library/Images/logo.png';
import { mobilecheck } from '../../Library/helpers';

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

    if (yPos < 625) {
      iosIdx = 0;
    } else if (yPos < 700) {
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

    const iosCopy = [
      { header: 'Learn without Memorizing', body: 'Lorem ipsum' },
      { header: 'Specialize in Topics', body: 'doo dee doo doo' },
      { header: 'Compete Against Friends', body: 'alejandro goes wild!' }
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

    return (
      <Layout onWindowScroll={this.handleScroll}>
        {this.state.displayMobilePopup && <MobilePopup removeSelf={this.removeMobilePopup.bind(this)} />}
        <Header>WORDCRAFT</Header>
        <Container>
          <Subtitle>
            Expand your vocabulary.
          </Subtitle>
          <Explanation>
            Learn advanced vocabulary using the Latin and Greek roots of English.  Learn faster and more efficiently.
          </Explanation>
        </Container>
        <DaisyChainContainer>
          <DaisyChainAnimation />
        </DaisyChainContainer>
        <Header>
          IOS APP
        </Header>
        <IOSContainer>
          {iosSections()}
        </IOSContainer>
        <ScreenshotContainer>
          <Screenshot src={require(`../../Library/Images/screenshot-0.png`)} />
        </ScreenshotContainer>
        <Header>
          BRING TO YOUR CLASSROOM
        </Header>
      </Layout>
    );
  }
}
/*
        {false && <div><Buttons>
          {ActionButton('singlePlayer', this.redirect.bind(this))}
          {ActionButton('multiplayer', this.redirect.bind(this))}
          {ActionButton('education', this.redirect.bind(this))}
        </Buttons>
        <Buttons>
          {ActionButton('ios')}
          {ActionButton('android')}
        </Buttons></div>}
        */
const Header = styled.h1`
  color: ${color.yellow};
  padding-left: 2.5%;
  font-size: 3em;
  letter-spacing: 5px;
  margin-bottom: 75px;
  margin-top: 50px;
`

const Container = styled.div`
  vertical-align: top;
  margin-left: 5%;
  width: 40%;
  height: 300px;
  margin-bottom: 100px;
  display: inline-block;
`

const DaisyChainContainer = styled.div`
  margin-left: 5%;
  width: 40%;
  height: 300px;
  display: inline-block;
`

const Subtitle = styled.p`
  font-size: 2em;
  letter-spacing: 1px;
  color: ${color.darkGray};
  line-height: 60px;
`

const IOSContainer = styled.div`
  margin-left: 5%;
  width: 45%;
  vertical-align: top;
  display: inline-block;
`

const IOSSection = styled.div`
  height: 200px;
  cursor: pointer;
`

const IOSSectionHeader = styled.h3`
  color: ${props => props.selected ? color.yellow : color.gray};
`

const IOSSectionP = styled.p`
  visibility: ${props => props.selected ? 'visible' : 'hidden'};
`

const Explanation = styled.p`
  color: ${color.gray};
  font-size: 1.25em;
  line-height: 40px;
`

const ScreenshotContainer = styled.div`
  display: inline-block;
  width: 50%;
`

const Screenshot = styled.img`
  width: 50%;
  height: auto;
  border: 2px solid ${color.yellow};
`

const Layout = styled.div`
  height: 100%;
  width: 100%;
`

const Logo = styled.img`
  height: 20%;
  width: auto;
  display: block;
  margin: auto;
  padding-top: 2.5%;
`

const Title = styled.h2`
  color: ${color.yellow};
  font-size: 3em;
  height: 5%;
  text-align: center;
`

const Buttons = styled.div`
  margin: auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`

export default Home;
