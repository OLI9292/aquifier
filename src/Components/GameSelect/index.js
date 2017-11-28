import React, { Component } from 'react';
import queryString from 'query-string';
import { Redirect } from 'react-router';
import styled from 'styled-components';
import _ from 'underscore';
import Firebase from '../../Networking/Firebase';

import Button from '../Common/button';
import Textarea from '../Common/textarea';
import { color } from '../../Library/Styles/index';
import { lighten10 } from '../../Library/helpers';
import explorePng from '../../Library/Images/explore-white.png';
import readPng from '../../Library/Images/read-white.png';
import studyPng from '../../Library/Images/study-white.png';
import competePng from '../../Library/Images/compete-color.png';
import singlePlayerPng from '../../Library/Images/singleplayer.png';
import setupMatchPng from '../../Library/Images/setupmatch.png';
import User from '../../Models/User';

class GameSelect extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: null,
      errorMessage: ''
    };
  }

  async componentDidMount() {
    const userId = localStorage.getItem('userId');
    if (userId) { this.loadUser({ type: 'id', value: userId }) };
  }

  loadUser = async (query) => {
    const result = await User.fetch(query);
    if (result && result.data && result.data.user) {
      const user = result.data.user;
      const isTeacher = user.isTeacher;
      this.setState({ loggedIn: true, isTeacher: isTeacher });
    }
  }

  handleClick(game, multiplayer = false) {
    const players = multiplayer ? 'multi' : 'single';
    this.setState({ redirect: `/play/game=${game}&players=${players}&setup=true` });
  }

  handleGameButtonClick(game) {
    if (!this.state.isTeacher) {
      this.setState({ redirect: `/play/game=${game}&players=single&setup=true` });
    }
  }

  joinMatch = async () => {
    const name = localStorage.getItem('username') || '';
    const accessCode = this.state.accessCode;

    const canEnterMatchResult = await Firebase.canEnterGame(name, accessCode);
    const canEnterMatch = canEnterMatchResult[0];
    if (!canEnterMatch) {
      this.setState({ errorMessage: canEnterMatchResult[1] });
    } else {
      const joinMatchResult = await Firebase.joinGame(name, accessCode);
      if (joinMatchResult) {
        canEnterMatchResult[1].accessCode = accessCode;
        const match = queryString.stringify(_.pick(canEnterMatchResult[1], 'status', 'accessCode'));
        this.setState({ redirect: `/play/${match}` });
      } else {
        this.setState({ errorMessage: 'Unable to join game.' });
      }
    }
  }

  render() {
    if (this.state.redirect && !window.location.href.endsWith(this.state.redirect)) {
      return <Redirect push to={this.state.redirect} />;
    }

    const isTeacher = this.state.isTeacher;
    const isStudent = this.state.loggedIn && !this.state.isTeacher;

    const buttons = (game) => {
      const setupMatchDisplay = isTeacher && game !== 'read' ? 'block' : 'none';
      return this.state.isTeacher ?
      <div style={{display:'flex',justifyContent:'space-around',margin:'25px 10px 25px 10px'}}>
        <PlayButton onClick={() => this.handleClick(game)} color={'white'}>
          {Button.imageAndText(singlePlayerPng, 'Preview Game')}
        </PlayButton>
        <PlayButton onClick={() => this.handleClick(game, true)} color={'white'} style={{display:setupMatchDisplay}}>
          {Button.imageAndText(setupMatchPng, 'Setup Match')}
        </PlayButton>
      </div>
        :
        <div style={{display:'flex',justifyContent:'space-around',margin:'25px 10px 25px 10px'}}>
          <Button.medium onClick={() => this.handleClick(game)} style={{backgroundColor: 'white', color: color.darkGray}}>
          Play
          </Button.medium>
        </div>
    }

    const compete = () => {
      const display = isStudent ? '' : 'none';
      return <GameButton style={{display:display}} color={'white'} border={`1px solid ${color.orange}`}>
        <Image src={competePng} />
        <p style={{color:color.orange,fontSize:'2em',height:'10px',lineHeight:'10px'}}>Compete</p>
        <div style={{width:'250px'}}>
          <p style={{color:color.orange,width:'90%',margin:'0 auto',fontSize:'1.25em'}}>
            Compete against your classmates.
          </p>
          <div style={{display:'flex',justifyContent:'space-around',margin:'25px 10px 25px 10px'}}>
            <Textarea.medium onChange={(e) => this.setState({ accessCode: e.target.value.trim() })}
              style={{textAlign:'center'}} placeholder={'access code'} />
            <Button.extraSmall onClick={() => this.joinMatch()} color={color.orange} style={{marginLeft:'5px'}}>Play</Button.extraSmall>
          </div>
        </div>
      </GameButton>
    }

    return (
      <div style={{paddingTop:'25px'}}>
        <Title>Choose Your Game</Title>
        <div style={{textAlign:'center'}}>

          <GameButton color={color.blue} onClick={() => this.handleGameButtonClick('study') }>
            <Image src={studyPng} />
            <p style={{color:'white',fontSize:'2em',height:'10px',lineHeight:'10px'}}>Study</p>
            <div style={{width:'250px'}}>
              <p style={{color:'white',width:'90%',margin:'0 auto',fontSize:'1.25em'}}>
                Thousands of words grouped by curriculum.
              </p>
              {buttons('study')}
            </div>
          </GameButton>

          <GameButton color={color.green} onClick={() => this.handleGameButtonClick('explore') }>
            <Image src={explorePng} />
            <p style={{color:'white',fontSize:'2em',height:'10px',lineHeight:'10px'}}>Explore</p>
            <div style={{width:'250px'}}>
              <p style={{color:'white',width:'90%',margin:'0 auto',fontSize:'1.25em'}}>
                The core vocabulary of dozens of subjects.
              </p>
              {buttons('explore')}
            </div>
          </GameButton>

          <GameButton color={color.red} onClick={() => this.handleGameButtonClick('read') }>
            <Image src={readPng} />
            <p style={{color:'white',fontSize:'2em',height:'10px',lineHeight:'10px'}}>Read</p>
            <div style={{width:'250px'}}>
              <p style={{color:'white',width:'90%',margin:'0 auto',fontSize:'1.25em'}}>
                Passages with vocabulary in context.
              </p>
              {buttons('read')}
            </div>
          </GameButton>

          {compete()}

          <p style={{textAlign:'center',color:color.red}}>{this.state.errorMessage}</p>

        </div>
      </div>
    );
  }
}

const Title = styled.div`
  background-color: ${color.orange};
  width: 450px;
  margin: 0 auto;
  height: 90px;
  line-height: 90px;
  margin-bottom: 25px;
  border-radius: 5px;
  text-align: center;
  font-size: 2.75em;
  color: white;
`

const Image = styled.img`
  height: 75px;
  width: 75px;
  padding-top: 20px;
`
const PlayButton = Button.extraSmall.extend`
  color: black;
  margin: 5px;
  &:hover {
    background-color: ${color.lightGray};
  }
`
const GameButton = styled.div`
  background-color: ${props => props.color};
  &:hover {
   background-color: ${props => lighten10(props.color)};
  }
  transition: 0.2s;
  cursor: pointer;
  border: ${props => props.border};
  text-align: center;
  display: inline-block;
  margin: 10px;
  border-radius: 5px;
  vertical-align: top;
  width: 250px;
  height: 350px;
`
export default GameSelect;
