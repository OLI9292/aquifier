import React, { Component } from 'react';
import { Redirect } from 'react-router';
import styled from 'styled-components';
import _ from 'underscore';

import Buttons from '../Buttons/default';
import { color } from '../../Library/Styles/index';
import HelpText from '../HelpText/index';
import questionMark from '../../Library/Images/question-mark.png';
import GLOBAL from '../../Library/global';

const buttonContent = (src, text) => {
  return <Content>
    <Image src={require(`../../Library/Images/${src}`)} />
    <ContentText>{text}</ContentText>
  </Content>;
}

const Content = styled.div`
  width: 90%;
  height: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Image = styled.img`
  height: 75%;
  margin-right: 5%;
  width: auto;
`

const ContentText = styled.p`
  display: table-cell;
  vertical-align: middle;
`

class Settings extends Component {
  constructor(props) {
    super(props);

    this.state = { 
      timeIdx: 0,
      levelIdx: 0,
      topicIndices: [0],
      redirect: false,
      showHelpText: false
    };

    this.handleClick = this.handleClick.bind(this);
    this.redirect = this.redirect.bind(this);
  }

  redirect() {
    this.setState({ redirect: true });
  }

  handleClick(group, idx) {
    switch (group) {
      case 'time':
        this.setState({ timeIdx: idx });
        break;
      case 'level':
        this.setState({ levelIdx: idx });
        break;
      case 'topic':
        const indices = _.contains(this.state.topicIndices, idx)
          ? this.state.topicIndices.filter((tIdx) => tIdx !== idx)
          : this.state.topicIndices.concat([idx])
        this.setState({ topicIndices: indices });
        break;
      default:
        break;
    }
  }

  showHelpText() {
    this.setState({ showHelpText: true });
  }

  hideHelpText() {
    this.setState({ showHelpText: false });
  }

  render() {
    const times = GLOBAL.SETTINGS.TIME;
    const levels = GLOBAL.SETTINGS.LEVEL;
    const topics = GLOBAL.SETTINGS.TOPIC;

    if (this.state.redirect) {
      const params = `time=${times[this.state.timeIdx]}` +
        `&level=${levels[this.state.levelIdx]}` +
        `${this.state.topicIndices.map((idx) => `&topic=${topics[idx].slug}`).join('')}`;
      const location = this.props.multiplayer ? `/game/admin/${params}` : `/game/sp/${params}`;
      return <Redirect push to={location} />;
    }

    const timeButtons = times.map((t, idx) => {
      return <SelectionButton 
        key={idx}
        onClick={() => this.handleClick('time', idx)} 
        selected={this.state.timeIdx === idx}
      >{`${t} Minutes`}</SelectionButton>
    });

    const levelButtons = levels.map((l, idx) => {
      return <SelectionButton 
        key={idx}
        onClick={() => this.handleClick('level', idx)} 
        selected={this.state.levelIdx === idx}
      >{l}</SelectionButton>
    });

    const topicButtons = topics.map((t, idx) => {
      return <SelectionButton 
        key={idx}
        onClick={() => this.handleClick('topic', idx)} 
        selected={_.contains(this.state.topicIndices, idx)}
      >{buttonContent(`${t.slug}.png`, t.displayName)}</SelectionButton>
    });

    return (
      <Layout>
        <Selection>
          <tr>
            <ShortCell><Text>Time</Text></ShortCell>
            <QuestionMark style={{visibility: 'hidden'}} src={questionMark} />
            <LongCell>{timeButtons}</LongCell>
          </tr>
          <tr>
            <ShortCell><Text>Level</Text></ShortCell>
            <QuestionMark onMouseOver={this.showHelpText.bind(this)} onMouseLeave={this.hideHelpText.bind(this)} src={questionMark} />
            {this.state.showHelpText && <HelpText />}
            <LongCell>{levelButtons}</LongCell>
          </tr>
          <tr>
            <ShortCell><Text>Topic</Text></ShortCell>
            <QuestionMark style={{visibility: 'hidden'}} src={questionMark} />
            <LongCell>{topicButtons}</LongCell>
          </tr>
        </Selection>
        <ButtonContainer>
          <AccessCodeButton onClick={this.redirect}>
            {this.props.multiplayer ? 'Generate Access Code for Match' : 'Play'}
          </AccessCodeButton>
        </ButtonContainer>
      </Layout>
    );
  }
}

const Layout = styled.div`
  padding: 5% 0 5% 0;
`

const Selection = styled.div`
  margin-left: 20px;
`

const ShortCell = styled.td`
  vertical-align: top;
  width: 100px;
`

const LongCell = styled.td`
  vertical-align: top;
  width: 100%;
  padding-bottom: 3em;
`

const Text = styled.h4`
  display: inline;
  font-size: 2em;
  margin-right: 10px;
`

const QuestionMark = styled.img`
  height: 20px;
  width: 20px;
  padding-right: 2em;
  cursor: pointer;
`

const SelectionButton = Buttons.medium.extend`
  background-color: ${props => props.selected ? color.red : color.lightestGray};
  color: ${props => props.selected ? 'white' : 'black'};
  margin: 0 0.5em 0.5em 0;
`

const ButtonContainer = styled.div`
  width: 100%;
  text-align: center;
`

const AccessCodeButton = Buttons.extraLarge.extend`
  background-color: ${color.blue};
  &:hover {
    background-color: ${color.blue10l};
  }
  font-size: 2.5em;
  height: 125px;
`

export default Settings;
