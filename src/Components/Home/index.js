import { connect } from 'react-redux'
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';
import styled from 'styled-components';
import throttle from 'lodash/throttle';

import { color } from '../../Library/Styles/index';
import TESTIMONIALS from './testimonials';
import Card from './card';
import CTA from './cta';
import Button from '../Common/button';
import DaisyChain from './daisyChain';
import Header from '../Header/index';
import { shouldRedirect } from '../../Library/helpers';

import bgYellow from '../../Library/Images/Home/bg-yellow.png';
import bgYellowFooter from '../../Library/Images/Home/bg-yellow-footer.png';
import bgBlueStraight from '../../Library/Images/Home/bg-blue-straight.png';
import morphemeCube from '../../Library/Images/Home/cube.png';
import downloadOnAppStore from '../../Library/Images/Home/download-on-app-store.svg';

const morphemeText = 'Studies have shown that morphemes supercharge vocabulary, thus enhancing ' +
  'literacy and reading comprehension. Wordcraft makes morphemes fun, addictive, and easy to ' +
  'acquire.';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.checkWindowSize = this.checkWindowSize.bind(this);
  }

  componentDidMount() {
    this.redirectIfLoggedIn(this.props);
    window.addEventListener('resize', throttle(this.checkWindowSize, 1000));
    this.checkWindowSize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', throttle(this.checkWindowSize, 1000));
  }

  componentWillReceiveProps(nextProps) {
    this.redirectIfLoggedIn(nextProps);
  }

  redirectIfLoggedIn(props) {
    if (props.session) { 
      const [justSignedUp, isTeacher] = [sessionStorage.getItem('justSignedUp'), props.session.isTeacher];
      sessionStorage.removeItem('justSignedUp');
      const redirect = justSignedUp ? '/welcome' : isTeacher ? '/my-class' : '/home';
      this.setState({ redirect });
    };     
  }

  checkWindowSize() {
    const smallScreen = document.body.clientWidth < 900;
    this.setState({ smallScreen });
  }

  displaySignUp() {
    window.scrollTo(0,0);
    this.setState({ displaySignUp: false }, () => this.setState({ displaySignUp: true }));
  }

  render() {
    if (shouldRedirect(this.state, window.location)) { return <Redirect push to={this.state.redirect} />; }

    return (
      <div>
        <TopContainer>
          <TopImage image={bgYellow} />
        </TopContainer>

        <div style={{position:'relative'}}>
          <Header
            displaySignUp={this.state.displaySignUp}
            path={'/'} />

          <TopContentContainer>
            <h1 style={{fontFamily:'BrandonGrotesqueBold',fontSize:'2.5em'}}>
              THE BUILDING BLOCKS OF ENGLISH
            </h1>

            <h3 style={{fontFamily:'EBGaramondSemiBold',fontSize:'1.5em'}}>
              Decipher vocabulary and enhance literacy with gamified Latin and Greek roots.
            </h3>
          </TopContentContainer>   

          <DaisyChainContainer>
            <DaisyChain smallScreen={this.state.smallScreen} />
          </DaisyChainContainer>
        </div>
      
        <ButtonContainer smallScreen={this.state.smallScreen}>
          <ButtonExt smallScreen={this.state.smallScreen} color={color.mainBlue}>
            <Link style={{textDecoration:'none',color:'white'}} to={'/play/type=factoidDemo'}>
              play demo
            </Link>
          </ButtonExt>
          {this.state.smallScreen && <br />}
          <ButtonExt smallScreen={this.state.smallScreen} color={color.green}>
            <p
              onClick={this.displaySignUp.bind(this)}
              style={{textDecoration:'none',color:'white',margin:'0'}}>
              sign up
            </p>
          </ButtonExt>
        </ButtonContainer>

        <TestimonialsContainer>
          <TestimonialsImage image={bgBlueStraight}>

            <div style={{display:'flex',color:'white'}}>
              <div style={{textAlign:'right',margin:'35px 5% 35px 15%'}}>
                <p style={{fontFamily:'BrandonGrotesqueBold',fontSize:'1.5em'}}>
                  {TESTIMONIALS[0].quote}
                </p>
                <WhiteLine align={'right'}/>
                <p style={{fontFamily:'EBGaramond',paddingTop:'25px'}}>
                  {TESTIMONIALS[0].from}
                </p>
              </div>
              <div style={{textAlign:'left',margin:'35px 15% 35px 5%'}}>
                <p style={{fontFamily:'BrandonGrotesqueBold',fontSize:'1.5em'}}>
                  {TESTIMONIALS[1].quote}
                </p>
                <WhiteLine align={'left'}/>
                <p style={{fontFamily:'EBGaramond',paddingTop:'25px'}}>
                  {TESTIMONIALS[1].from}
                </p>
              </div>
            </div>

          </TestimonialsImage>
        </TestimonialsContainer>   

        <MorphemeContainer>

          <MorphemeCubeContainer>
            <img 
              alt={'omni-carn-herb'}
              src={morphemeCube}
              style={{height:'100%',width:'auto',}}
              />
          </MorphemeCubeContainer>

          <div>
            <p style={{fontFamily:'BrandonGrotesqueBold',color:color.gray2,fontSize:'1.75em'}}>
              Morphemes are the best way to build vocabulary
            </p>
            <p style={{fontFamily:'EBGaramond',lineHeight:'30px',fontSize:'1.25em'}}>
              {morphemeText}
            </p>          
          </div>
        </MorphemeContainer>

        <Card
          smallScreen={this.state.smallScreen}
          type={'howItWorks'}
          inverted={false} />

        <Card
          smallScreen={this.state.smallScreen}
          type={'multiplayer'}
          inverted={true} />

        <Card
          smallScreen={this.state.smallScreen}
          type={'progressReport'}
          inverted={false} />

        <Card
          smallScreen={this.state.smallScreen}
          type={'readingComprehension'}
          inverted={true} />

        <CTA
          displaySignUp={this.displaySignUp.bind(this)}
          smallScreen={this.state.smallScreen} /> 

        <AppleContainer>
          <p style={{fontFamily:'BrandonGrotesqueBold',textAlign:'right',fontSize:'1.5em',width:'45%'}}>
            Also available for solo or supplemental training
          </p>
          <div style={{width:'10%',height:'100%'}} />
          <div style={{width:'45%'}}>
            <a href='https://www.bit.ly/playwordcraft' target='_blank' rel='noopener noreferrer'>
              <img
                alt={'download-on-app-store'}
                src={downloadOnAppStore}
                style={{height:this.state.smallScreen ? '50px' : '75px',width:'auto'}} />
            </a>
          </div>
        </AppleContainer>   

        <BottomContainer>             
          <BottomImage image={bgYellowFooter}>        
            <BottomNav>
              <Link
                to={'/team'}
                style={{textTransform:'uppercase',textDecoration:'none',color:'black',fontSize:'0.75em',letterSpacing:'1px'}}>
                about
              </Link>
              <Link
                to={'/research'}
                style={{textTransform:'uppercase',textDecoration:'none',color:'black',fontSize:'0.75em',letterSpacing:'1px'}}>
                research
              </Link>
              <Link
                to={'/contact'}
                style={{textTransform:'uppercase',textDecoration:'none',color:'black',fontSize:'0.75em',letterSpacing:'1px'}}>
                contact
              </Link>  
              <Link
                to={'/privacy'}
                style={{textTransform:'uppercase',textDecoration:'none',color:'black',fontSize:'0.75em',letterSpacing:'1px'}}>
                privacy policy
              </Link>  
              <Link
                to={'/terms'}
                style={{textTransform:'uppercase',textDecoration:'none',color:'black',fontSize:'0.75em',letterSpacing:'1px'}}>
                terms of service
              </Link>                
            </BottomNav>
          </BottomImage>        
        </BottomContainer>             
      </div>
    );
  }
}


const TopContainer = styled.div`
  height: 550px;
  width: 100%;
  position: absolute;
  top: 0;
  overflow: hidden !important;
`

const TopImage = styled.div`
  background: url(${props => props.image}) no-repeat bottom center;
  background-size: cover;
  width: auto;
  height: 100%;
  min-width: 600px;
  padding-top: 20px;
  overflow: hidden !important;
`

const TopContentContainer = styled.div`
  display: inline-block;
  width: 40%;
  vertical-align: top;
  margin: 0% 10% 0% 10%;
  @media (max-width: 900px) {
    width: 80%;
  }
`

const DaisyChainContainer = styled.div`
  display: inline-block;
  margin-top: 75px;
  @media (max-width: 900px) {
    width: 100%;
    margin: 0 auto;
    margin-top: 50px;
  }  
`

const ButtonContainer = styled.div`
  margin-left: ${props => props.smallScreen ? '' : '10%'};
  margin-top: 40px !important;
  position: relative;
  display: ${props => props.smallScreen ? 'flex' : ''};
  flex-direction: ${props => props.smallScreen ? 'column' : ''};
`

const ButtonExt = Button.medium.extend`
  width: 225px;
  background-color: ${props => props.color};
  margin: ${props => props.smallScreen ? '0 auto' : '0px 20px 0px 0px'};
`

const BottomNav = styled.div`
  font-family: BrandonGrotesqueBold;
  display: flex;
  justify-content: space-evenly;
  width: 50%;
  margin: 0 auto;
  margin-top: 275px;
  @media (max-width: 900px) {
    width: 80%;
    margin-top: 150px;
  }    
`

const BottomContainer = styled.div`
  height: 500px;
  width: 100%;
  overflow: hidden !important;
  @media (max-width: 900px) {
    height: 300px;
  }     
`

const BottomImage = styled.div`
  background: url(${props => props.image}) no-repeat top center;
  background-size: cover;
  width: auto;
  height: 100%;
  overflow: hidden !important;
`

const MorphemeContainer = styled.div`
  display: flex;
  width: 70%;
  margin: 0 auto;
  margin-top: 75px;
  margin-bottom: 75px;
  align-items: center;
  @media (min-width: 900px) {
    height: 300px;
  }
  @media (max-width: 900px) {
    width: 90%;
    text-align: center;
    display: block;
  }    
`

const MorphemeCubeContainer = styled.div`
  margin-right: 50px;
  height: 50%;
  @media (max-width: 900px) {
    height: 100px;
    margin-right: 0px;
  }      
`

const WhiteLine = styled.div`
  width: 50px;
  height: 2px;
  border-radius: 1px;
  background-color: white;
  float: ${props => props.align};
`

const TestimonialsContainer = styled.div`
  margin-top: 60px;
  width: 100%;
`

const TestimonialsImage = styled.div`
  background: url(${props => props.image}) repeat-x center center;
  background-size: cover;
  width: auto;
  width: 100%;
`

const AppleContainer = styled.div`
  display: flex;
  width: 50%;
  margin: 0 auto;
  justify-content: space-evenly;
  align-items: center;
  height: 250px;
  @media (max-width: 900px) {
    width: 90%;
  }     
`

const mapStateToProps = (state, ownProps) => ({
  session: state.entities.session
});

export default connect(mapStateToProps)(Home);
