import React, { Component } from 'react';
import styled from 'styled-components';
import { Redirect } from 'react-router';

import { shouldRedirect } from '../../Library/helpers';
import { color } from '../../Library/Styles/index';

import bgBlue from '../../Library/Images/Home/bg-blue.png';
import bgBlueStraight from '../../Library/Images/Home/bg-blue-straight.png';
import hatIcon from '../../Library/Images/Home/icon-hat.png';
import schoolIcon from '../../Library/Images/Home/icon-school.png';
import districtIcon from '../../Library/Images/Home/icon-district.png';

class CTA extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    if (shouldRedirect(this.state, window.location)) { return <Redirect push to={this.state.redirect} />; }

    return (
      <Container>
        <SignUpImage image={this.props.smallScreen ? bgBlueStraight : bgBlue}>

          <Header>
            CHOOSE YOUR PLAN
          </Header>  

          <SignUpCardContainer>
            <SignUpCard
              onClick={() => this.setState({ redirect: '/start-free-trial' })}
              color={'white'} marginBottom={'100px'}>
              <h2 style={{fontSize:'2em',paddingTop:'10px'}}>
                Individual
              </h2>
              
              <img
                alt={'hat'}
                style={{width:'25%',height:'auto'}}
                src={hatIcon} />
              
              <ul style={{textAlign:'left',width:'75%',margin:'0 auto',marginTop:'10px',fontSize:'1.25em'}}>
                <li>
                  personalized study
                </li>
                <li>
                  progress report
                </li>                  
              </ul>
              <div style={{position:'absolute',bottom:'25px',left:'25px'}}>
                <Button color={color.blue}>
                  START FREE TRIAL
                </Button>
              </div>
            </SignUpCard>

            <SignUpCard
              onClick={() => this.setState({ redirect: '/start-free-trial' })}
              color={color.warmYellow} marginBottom={'50px'}>
              <div style={{position:'absolute',height:'20px',width:'100%',backgroundColor:color.warmYellow,top:'0',zIndex:'100'}} />

              <div style={{position:'absolute',height:'70px',width:'100%',backgroundColor:color.orange,borderRadius:'20px',top:'-50px'}}>
                <p style={{fontFamily:'BrandonGrotesqueBold',color:'white',marginTop:'15px',fontSize:'1.1em'}}>
                  MOST POPULAR
                </p>
              </div>

              <h2 style={{fontSize:'2em',paddingTop:'10px'}}>
                School
              </h2>
              
              <img
                alt={'school'}
                style={{width:'25%',height:'auto'}}
                src={schoolIcon} />
              
              <ul style={{textAlign:'left',width:'75%',margin:'0 auto',marginTop:'10px',fontSize:'1.25em'}}>
                <li>
                  automated grading
                </li>
                <li>
                  progress reports
                </li>             
                <li>
                  in-class games
                </li>                                    
              </ul>
              <div style={{position:'absolute',bottom:'25px',left:'25px'}}>
                <Button color={color.orange} visibile={!this.props.smallScreen}>
                  START FREE TRIAL
                </Button>
              </div>
            </SignUpCard>

            <SignUpCard
              onClick={() => this.setState({ redirect: '/start-free-trial' })}
              color={'white'} marginBottom={'50px'}>
              <h2 style={{fontSize:'2em',paddingTop:'10px'}}>
                District
              </h2>
              
              <img
                alt={'district'}
                style={{width:'25%',height:'auto'}}
                src={districtIcon} />
              
              <ul style={{textAlign:'left',width:'75%',margin:'0 auto',marginTop:'10px',fontSize:'1.25em'}}>
                <li>
                  all school edition features
                </li>
                <li>
                  district level reporting
                </li>
                <li>
                  curriculum alignment
                </li>             
                <li>
                  benchmark assesments
                </li>                                    
              </ul>
              <div style={{position:'absolute',bottom:'25px',left:'25px'}}>
                <Button color={color.blue} visibile={!this.props.smallScreen}>
                  START FREE TRIAL
                </Button>
              </div>
            </SignUpCard>
          </SignUpCardContainer>        

        </SignUpImage>        
      </Container>
    );
  }
}

const Container = styled.div`
  width: 100%;
  @media (min-width: 900px) {
    height: 900px;
  }    
`

const Header = styled.h1`
  font-family: BrandonGrotesqueBold;
  font-size: 3em;
  text-align: center;
  padding-top: 200px;
  color: white;
  @media (max-width: 900px) {
    padding-top: 50px;
    margin-top: 0px;
    font-size: 2em;
  }    
`

const SignUpCardContainer = styled.div`
  display: flex;
  width: 90%;
  text-align: center;
  margin: 0 auto;
  justify-content: space-evenly;
  margin-top: 100px;
  @media (min-width: 900px) {
    height: 450px;
  }    
  @media (max-width: 900px) {
    display: block;
    margin-top: 50px;
  }  
`

const SignUpCard = styled.div`
  cursor: pointer;
  background-color: ${props => props.color};
  border-radius: 20px;
  width: 300px;
  position: relative;
  @media (max-width: 900px) {
    height: 400px;
    margin: 0 auto;
    margin-bottom: ${props => props.marginBottom};
  }   
`

const SignUpImage = styled.div`
  background: url(${props => props.image}) no-repeat top center;
  background-size: cover;
  width: auto;
  height: 100%;
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

export default CTA;
