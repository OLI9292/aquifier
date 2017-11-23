import React, { Component } from 'react';
import { Redirect } from 'react-router';
import styled from 'styled-components';

import Button from '../Common/button';
import DaisyChain from './daisyChain';
import InfoForm from '../InfoForm/index';
import Header from '../Header/index';
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

  render() {
    if (this.state.redirect && !window.location.href.endsWith(this.state.redirect)) {
      return <Redirect push to={this.state.redirect} />;
    }

    if (localStorage.getItem('userId') !== null) {
      this.setState({ redirect: '/play'});
    }

    const introSection = () => {
      return <TopLeftContainer>
        <Subtitle>
          Learn English vocabulary through Greek and Latin root words.
        </Subtitle>
        <Explanation>
          Prepare for a test. Explore a subject. Learn vocabulary in context with reading comprehension. Compete against classmates in a multiplayer spelling bee.
        </Explanation>
        {this.state.isSmallScreen && <DaisyChain />}
        <div style={{textAlign:'center'}}>
          <Button.medium color={color.green} style={{width:'90%'}} onClick={() => this.setState({ redirect: '/play' })}>Play Now</Button.medium>
          {Button.iOS({width:'90%',marginTop:'15px'})}
        </div>
      </TopLeftContainer>
    }

    const howItWorksSection = () => {
         return <Container>
           <Heading color={color.blue}>
             HOW IT WORKS
           </Heading>
           <ScreenshotContainer>
            <Screenshot src={require('../../Library/Images/example.png')} />
           </ScreenshotContainer>
           <TextContainer>
             <Text><BlackSpan><b>60% of English words</b></BlackSpan> have Greek or Latin roots.  In the fields of science and technology, that number is <BlackSpan><b>above 90%.</b></BlackSpan><br /><br />By solving fast-paced puzzles, students learn hundreds of roots and thousands of words.  Wordcraft is the most fun and efficient way to acquire a large vocabulary.</Text>
             <Button.medium color={color.green} style={{width:'90%'}} onClick={() => this.setState({ redirect: '/play' })}>Play Now</Button.medium>
           </TextContainer>
         </Container>
       }

    const StartFreeTrialForm = () => {
      return <Container>
        <Heading color={color.green}>
          START FREE TRIAL
        </Heading>
        <InfoForm />
      </Container>
    }

    return (
      <OuterContainer>
        <Header />
        <InnerContainer>
          {introSection()}
          {!this.state.isSmallScreen && <DaisyChainContainer><DaisyChain /></DaisyChainContainer>}
          {howItWorksSection()}
          {StartFreeTrialForm()}
        </InnerContainer>
      </OuterContainer>
    );
  }
}

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
  padding-left: 5%;
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
  margin-top: 25px;
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
  margin-top: 25px;
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
  -webkit-margin-before: -1em;
  @media (max-width: 1100px) {
    font-size: 1.2em;
    line-height: 30px;
    -webkit-margin-before: 1em;
  }
  @media (max-width: 450px) {
    font-size: 0.9em;
    line-height: 25px;
  }`
// Other Section Components

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

const Container = styled.div`
  width: 100%;
  margin: auto;
  margin-top: 40px;
  padding-top: 15px;
  border-radius: 10px;
  height: 750px;
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
  }`

export default Home;
