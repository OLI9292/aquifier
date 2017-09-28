import React, { Component } from 'react';
import { Redirect } from 'react-router';
import styled from 'styled-components';

import ActionButton from '../Buttons/action';
import MobilePopup from '../MobilePopup/index';
import DaisyChainAnimation from '../DaisyChainAnimation/index';
import InfoForm from '../InfoForm/index';
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
          <div>
            <div style={{marginBottom: '20px', marginTop: '20px'}}>
              {ActionButton('singlePlayer', this.redirect.bind(this))}
            </div>
            <div>
              {ActionButton('multiplayer', this.redirect.bind(this))}
            </div>
          </div>
        </Container>
        <DaisyChainContainer>
          <DaisyChainAnimation />
        </DaisyChainContainer>
        <Header style={{backgroundColor: color.blue, color: 'white'}}>
          IOS APP
        </Header>
        <IOSContainer>
          <IOSSectionsContainer>
            {iosSections()}
          </IOSSectionsContainer>
          <ScreenshotContainer>
            <Screenshot src={require(`../../Library/Images/screenshot-0.png`)} />
          </ScreenshotContainer>
        </IOSContainer>
        <Header>
          BRING TO YOUR CLASSROOM
        </Header>
        <InfoForm />
      </Layout>
    );
  }
}

const Header = styled.h1`
  color: ${color.yellow};
  padding-left: 5%;
  font-size: 3em;
  letter-spacing: 2px;
  padding-top: 25px;
  margin-bottom: 0px;
  padding-bottom: 25px;
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
  line-height: 20px;
`

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

const Explanation = styled.p`
  color: ${color.gray};
  font-size: 1.25em;
  line-height: 40px;
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
