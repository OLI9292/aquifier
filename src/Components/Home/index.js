import React, { Component } from 'react';
import { Redirect } from 'react-router';
import styled from 'styled-components';

import Button from '../Common/button';
import DaisyChain from './daisyChain';
import InfoForm from '../InfoForm/index';
import Header from '../Header/index';
import HelpText from '../HelpText/index';
import { color } from '../../Library/Styles/index';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: null,
      isSmallScreen: false,
      iosIdx: 0,
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
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.checkWindowSize.bind(this));
  }

  redirect(location) {
    this.setState({ redirect: location });
  }

  showHelpText() {
    this.setState({ showHelpText: true });
  }

  hideHelpText() {
    this.setState({ showHelpText: false });
  }

  render() {
    if (this.state.redirect && !window.location.href.endsWith(this.state.redirect)) {
      return <Redirect push to={this.state.redirect} />;
    }

    const introSection = () => {
      return <TopLeftContainer>
        <Subtitle>
          Master the Greek and Latin roots of English.
        </Subtitle>
        {this.state.isSmallScreen && <DaisyChain />}
        <Explanation>
          Expand your vocabulary without memorizing long lists of words. Prepare for a test, specialize in a topic, or just learn the entire dictionary.
        </Explanation>
      </TopLeftContainer>
    }

    const howItWorksSection = () => {
      return <Container>
        <Heading padLeft color={color.blue}>
          HOW IT WORKS
        </Heading>
        <ScreenshotContainer>
          <Screenshot src={require('../../Library/Images/example.png')} />
        </ScreenshotContainer>
        <TextContainer>
          <Text><BlackSpan><b>60% of English words</b></BlackSpan> have Greek or Latin roots.  In the fields of science and technology, that number is <BlackSpan><b>above 90%.</b></BlackSpan><br /><br />By solving fast-paced puzzles, you will learn hundreds of roots and thousands of words.  Wordcraft is the most fun and efficient way to acquire a large vocabulary.</Text>
          <Button.iOS />
        </TextContainer>
      </Container>
    }

    const masterATopicSection = () => {
      return <Container>
        <Heading padLeft color={color.red}>
          MASTER A TOPIC
        </Heading>
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
        <Heading padLeft color={color.orange}>
          SPELLING BEE
        </Heading>
        <ScreenshotContainer>
          <Screenshot src={require(`../../Library/Images/results.png`)} />
        </ScreenshotContainer>
        <TextContainer>
          <Text>Use <GoldSpan><b>WORDCRAFT</b></GoldSpan> spelling bee mode to quickly set up a fast-paced vocabulary game for your class.  Any number of players can join on their own computers.<br /><br />Click <BlackSpan onMouseOver={this.showHelpText.bind(this)} onMouseLeave={this.hideHelpText.bind(this)}><b>here</b></BlackSpan> for a full tutorial on in-class games.</Text>
          <Button.medium margin={'00px 0px 0px 10px'} onClick={() => this.redirect('/lobby')}
            color={color.green}>Play Spelling Bee!</Button.medium>
        </TextContainer>
      </Container>
    }
    const bringToYourClassroomForm = () => {
      return <Container>
        <Heading padLeft color={color.green}>
          BRING TO YOUR CLASSROOM
        </Heading>
        <InfoForm />
      </Container>
    }
    return (
      <OuterContainer>
        <Header />
        {this.state.showHelpText && <HelpTextContainer><HelpText type={'classroomTutorial'} /></HelpTextContainer>}
        <InnerContainer>
          {introSection()}
          {!this.state.isSmallScreen && <DaisyChainContainer><DaisyChain /></DaisyChainContainer>}
          {howItWorksSection()}
          {masterATopicSection()}
          {spellingBeeSection()}
          {bringToYourClassroomForm()}
        </InnerContainer>
      </OuterContainer>
    );
  }
}

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
const Heading = styled.h1`
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

// Top Section
const TopLeftContainer = styled.div`
  vertical-align: top;
  margin-top: 100px;
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
  margin-top: 100px;
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

const BlackSpan = styled.span`
  color: black;
`
const GoldSpan = styled.span`
  color: ${color.yellow};
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
