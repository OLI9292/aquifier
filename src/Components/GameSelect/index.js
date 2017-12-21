import { connect } from 'react-redux'
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
import { shouldRedirect } from '../../Library/helpers'

class GameSelect extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: '',
      loggedIn: false
    };
  }

  componentDidMount() {
    document.body.addEventListener('keydown', this.handleKeydown.bind(this), true);
    this.setup(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.setup(nextProps);
  }

  componentWillUnmount() {
    document.body.removeEventListener('keydown', this.handleKeydown.bind(this), true);
  }

  setup(props) {
    if (props.user && !this.state.loggedIn) {
      this.setState({ loggedIn: true, isTeacher: props.user.isTeacher });
    }
  }

  handleKeydown(event) {
    if (event.key !== 'Enter') { return; }
    event.preventDefault();
    const code = this.state.accessCode;
    if (code && code.trim().length === 4) { this.joinMatch(); }
  }

  handleClick(game, multiplayer = false) {
    const players = multiplayer ? 'multi' : 'single';
    this.setState({ redirect: `/play/game=${game}&players=${players}&setup=true` });
  }

  handleGameButtonClick(game) {
    if (this.state.isTeacher) { return; }
    this.setState({ redirect: `/play/game=${game}&players=single&setup=true` });
  }

  joinMatch = async () => {
    const name = this.props.user && `${this.props.user.firstName} ${this.props.user.lastName.charAt(0)}`;
    const accessCode = this.state.accessCode;

    const result = await Firebase.canEnterGame(name, accessCode);
    const canEnterMatch = result[0];

    if (!canEnterMatch) {
      this.setState({ error: result[1] });
    } else {
      const joined = await Firebase.joinGame(name, accessCode);

      if (joined) {
        result[1].accessCode = accessCode;
        const match = queryString.stringify(_.pick(result[1], 'status', 'accessCode'));
        this.setState({ redirect: `/play/${match}` });
      } else {
        this.setState({ error: 'Unable to join game.' });
      }
    }
  }

  render() {
    if (shouldRedirect(this.state, window.location)) { return <Redirect push to={this.state.redirect} />; }

    const isTeacher = this.state.isTeacher;
    const isStudent = this.state.loggedIn && !this.state.isTeacher;

    const buttons = (game) => {
      const display = isTeacher && game !== 'read' ? 'block' : 'none';

      return this.state.isTeacher 
      ?
      <div style={{display:'flex',justifyContent:'space-around',margin:'25px 10px 25px 10px'}}>
        <PlayButton onClick={() => this.handleClick(game)} color={'white'}>
          {Button.imageAndText(require('../../Library/Images/singleplayer.png'), 'Preview Game')}
        </PlayButton>
        <PlayButton onClick={() => this.handleClick(game, true)} color={'white'} style={{display:display}}>
          {Button.imageAndText(require('../../Library/Images/setupmatch.png'), 'Setup Match')}
        </PlayButton>
      </div>
      :
      <div style={{display:'flex',justifyContent:'space-around',margin:'25px 10px 25px 10px'}}>
        <Button.medium 
          onClick={() => this.handleClick(game)} 
          style={{backgroundColor:'white', color:color.darkGray}}>
          Play
        </Button.medium>
      </div>
    }

    const compete = () => {
      const display = isStudent ? '' : 'none';
      return <GameButton style={{display:display}} color={'white'} border={`1px solid ${color.orange}`}>
        <Image src={require('../../Library/Images/compete-color.png')} />
        <p style={{color:color.orange,fontSize:'2em',height:'10px',lineHeight:'10px'}}>
          Compete
        </p>
        <div style={{width:'250px'}}>
          <p style={{color:color.orange,width:'90%',margin:'0 auto',fontSize:'1.25em'}}>
            Compete against your classmates.
          </p>
          <div style={{display:'flex',justifyContent:'space-around',margin:'25px 10px 25px 10px'}}>
            <Textarea.medium 
              onChange={(e) => this.setState({ accessCode: e.target.value.trim() })}
              style={{textAlign:'center'}} 
              placeholder={'access code'} />
            <Button.extraSmall
              color={color.orange}
              onClick={() => this.joinMatch()}
              style={{marginLeft:'5px'}}>
              Play
            </Button.extraSmall>
          </div>
        </div>
      </GameButton>
    }

    return (
      <div style={{paddingTop:'25px'}}>
        <Title>Choose Your Game</Title>

        <div style={{textAlign:'center'}}>
          <GameButton color={color.blue} onClick={() => this.handleGameButtonClick('study') }>
            <Image src={require('../../Library/Images/study-white.png')} />
            <p style={{color:'white',fontSize:'2em',height:'10px',lineHeight:'10px'}}>Study</p>
            <div style={{width:'250px'}}>
              <p style={{color:'white',width:'90%',margin:'0 auto',fontSize:'1.25em'}}>
                Thousands of words grouped by curriculum.
              </p>
              {buttons('study')}
            </div>
          </GameButton>

          <GameButton color={color.green} onClick={() => this.handleGameButtonClick('explore') }>
            <Image src={require('../../Library/Images/explore-white.png')} />
            <p style={{color:'white',fontSize:'2em',height:'10px',lineHeight:'10px'}}>Explore</p>
            <div style={{width:'250px'}}>
              <p style={{color:'white',width:'90%',margin:'0 auto',fontSize:'1.25em'}}>
                The core vocabulary of dozens of subjects.
              </p>
              {buttons('explore')}
            </div>
          </GameButton>

          <GameButton color={color.red} onClick={() => this.handleGameButtonClick('read') }>
            <Image src={require('../../Library/Images/read-white.png')} />
            <p style={{color:'white',fontSize:'2em',height:'10px',lineHeight:'10px'}}>Read</p>
            <div style={{width:'250px'}}>
              <p style={{color:'white',width:'90%',margin:'0 auto',fontSize:'1.25em'}}>
                Passages with vocabulary in context.
              </p>
              {buttons('read')}
            </div>
          </GameButton>

          {compete()}

          <p style={{textAlign:'center',color:color.red}}>
            {this.state.error}
          </p>
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

const mapStateToProps = (state, ownProps) => ({
  session: state.entities.session,
  user: _.first(_.values(state.entities.user))
});

export default connect(mapStateToProps)(GameSelect);
