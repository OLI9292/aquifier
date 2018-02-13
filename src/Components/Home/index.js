import { connect } from 'react-redux'
import React, { Component } from 'react';
import { Redirect } from 'react-router';
import styled from 'styled-components';

import { color } from '../../Library/Styles/index';
import TESTIMONIALS from './testimonials';
import Card from './card';
import CTA from './cta';
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
    window.addEventListener('resize', this.checkWindowSize);
    this.checkWindowSize();
  }

  componentWillUnmount() {
    window.addEventListener('resize', this.checkWindowSize);
  }

  checkWindowSize() {
    const smallScreen = document.body.clientWidth < 900;
    this.setState({ smallScreen });
  }

  render() {
    if (shouldRedirect(this.state, window.location)) { return <Redirect push to={this.state.redirect} />; }
    if (this.props.session) { this.setState({ redirect: '/home'} )};

    return (
      <Container>
        <TopContainer>
          <TopImage image={bgYellow} />
        </TopContainer>

        <div style={{position:'relative'}}>
          <Header
            smallScreen={this.state.smallScreen}
            isHome={true} />

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
      
        <ButtonContainer>
          <Button color={color.blue} onClick={() => this.setState({ redirect: '/play'})}>
            PLAY NOW
          </Button>
          <Button
            onClick={() => this.setState({ redirect: '/start-free-trial' })}
            marginLeft color={color.green}>
            SIGN UP
          </Button>
        </ButtonContainer>

        <TestimonialsContainer>
          <TestimonialsImage image={bgBlueStraight}>

            <div style={{display:'flex',color:'white'}}>
              <div style={{textAlign:'right',margin:'35px 5% 35px 15%'}}>
                <p style={{fontFamily:'BrandonGrotesqueBold',fontSize:'1.5em'}}>
                  {TESTIMONIALS[0].quote}
                </p>
                <WhiteLine align={'right'}/>
                <p style={{fontFamily:'EBGaramond',fontSize:'1.25em',paddingTop:'25px'}}>
                  {TESTIMONIALS[0].from}
                </p>
              </div>
              <div style={{textAlign:'left',margin:'35px 15% 35px 5%'}}>
                <p style={{fontFamily:'BrandonGrotesqueBold',fontSize:'1.5em'}}>
                  {TESTIMONIALS[1].quote}
                </p>
                <WhiteLine align={'left'}/>
                <p style={{fontFamily:'EBGaramond',fontSize:'1.25em',paddingTop:'25px'}}>
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
            <p style={{fontFamily:'EBGaramond',fontSize:'1.25em',lineHeight:'30px'}}>
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

        <CTA smallScreen={this.state.smallScreen} /> 

        <AppleContainer>
          <p style={{fontFamily:'BrandonGrotesqueBold',textAlign:'right',fontSize:'1.5em',width:'45%'}}>
            Also available for solo or supplemental training
          </p>
          <div style={{width:'10%',height:'100%'}} />
          <div style={{width:'45%'}}>
            <a href='https://www.bit.ly/playwordcraft' target='_blank'>
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
              <p style={{cursor:'pointer',display:'none'}}>
                ABOUT              
              </p>
              <p style={{cursor:'pointer',display:'none'}}>
                METHODOLOGY
              </p>
              <p style={{cursor:'pointer',display:'none'}}>
                PARTNERS
              </p>      
              <p style={{transition:'0.5s'}}
                onMouseOver={() => this.setState({ hoveredOverContact: true })}>
                {this.state.hoveredOverContact ? 'SUPPORT@PLAYWORDCRAFT.COM' : 'CONTACT'}
              </p>      
            </BottomNav>
          </BottomImage>        
        </BottomContainer>             
      </Container>
    );
  }
}

const Container = styled.div`
  font-size: 0.8em;
`

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
  display: flex;
  margin-left: 10%;
  width: 50%;
  margin-top: 40px;
  position: relative;
  @media (max-width: 900px) {
    width: 80%;
    margin-top: 50px;
    justify-content: space-evenly;
  }  
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
  margin-top: 100px;
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

const Button = styled.button`
  font-family: BrandonGrotesqueBold;
  cursor: pointer;
  background-color: ${props => props.color};
  display: inline-block;
  color: white;
  margin-left: ${props => props.marginLeft ? '25px' : '0px'};
  outline: 0;
  border: 0;
  width: 250px;
  height: 60px;
  border-radius: 30px;
  font-size: 1.25em;
`

const mapStateToProps = (state, ownProps) => ({
  session: state.entities.session
});

export default connect(mapStateToProps)(Home);
