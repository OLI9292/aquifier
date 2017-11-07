import React, { Component } from 'react';
import { Redirect } from 'react-router';
import styled from 'styled-components';
import _ from 'underscore';

import Button from '../Common/button';
import { color } from '../../Library/Styles/index';
import HelpText from '../HelpText/index';
import Lesson from '../../Models/Lesson';
import questionMark from '../../Library/Images/question-mark.png';
import GLOBAL from '../../Library/global';

// TODO: - refactor
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
      everythingSelected: true,
      timeIdx: 0,
      levelIdx: 0,
      topicIndices: [0],
      demoIdx: 0,
      lessonIdx: -1,
      redirect: false,
      showHelpText: false,
      lessons: []
    };

    this.handleClick = this.handleClick.bind(this);
    this.redirect = this.redirect.bind(this);
  }

  async componentDidMount() {
    const userId = localStorage.getItem('userId');
    if (userId) {
      const result = await Lesson.forStudent(userId);
      if (result.data.length) {
        const lessons = result.data;
        this.setState({ lessons });
      }
    }
  }

  redirect() {
    this.setState({ redirect: true });
  }

  handleClick(group, idx) {
    switch (group) {
      case 'time':
        this.setState({ timeIdx: idx }, this.resetNonDemoSettings);
        break;
      case 'level':
        this.setState({ levelIdx: idx }, this.resetNonDemoSettings);
        break;
      case 'topic':
        const indices = idx === 0
          ? [0]
          : (_.contains(this.state.topicIndices, idx)
              ? this.state.topicIndices.filter((tIdx) => tIdx !== idx)
              : this.state.topicIndices.concat([idx]))
            .filter((idx) => idx !== 0)
        this.setState({ topicIndices: indices }, this.resetNonDemoSettings);
        break;
      case 'demo':
        this.setState({ demoIdx: idx }, this.turnOffNonDemoSettings);
        break;
      case 'lesson':
        this.setState({ lessonIdx: idx });
        break;        
      default:
        break;
    }
  }

  resetNonDemoSettings() {
    if (this.state.demoIdx > 0) {
      let state = { demoIdx: 0 };
      
      if (this.state.timeIdx < 0 || this.state.timeIdx > GLOBAL.SETTINGS.TIME.length - 1) {
        state['timeIdx'] = 0;
      }
      if (this.state.levelIdx < 0 || this.state.levelIdx > GLOBAL.SETTINGS.LEVEL.length - 1) {
        state['levelIdx'] = 0;
      }
      if (_.isEmpty(this.state.topicIndices)) {
        state['topicIndices'] = [0]
      }

      this.setState(state);
    }
  }

  showHelpText() {
    this.setState({ showHelpText: true });
  }

  hideHelpText() {
    this.setState({ showHelpText: false });
  }

  turnOffNonDemoSettings() {
    this.setState({ timeIdx: -1, levelIdx: -1, topicIndices: [] });
  }

  settings(times, levels, topics) {
    if (this.state.demoIdx > 0) {
      return `demo=${this.state.demoIdx}`;
    } else if (this.state.lessonIdx >= 0) {
      return `lesson=${this.state.lessons[this.state.lessonIdx]._id}`;
    } else {
      return `time=${times[this.state.timeIdx]}` +
      `&level=${this.state.levelIdx}` +
      `${this.state.topicIndices.map((idx) => `&topic=${topics[idx].slug}`).join('')}`;
    }
  }

  render() {
    const times = GLOBAL.SETTINGS.TIME;
    const levels = GLOBAL.SETTINGS.LEVEL;
    const topics = GLOBAL.SETTINGS.TOPIC;

    if (this.state.redirect && !window.location.href.endsWith(this.state.redirect)) {
      const settings = this.settings(times, levels, topics);
      const location = this.props.multiplayer ? `/game/admin/${settings}` : `/game/${settings}`;
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

    const demoButtons = _.range(1, 4).map((idx) => {
      return <SelectionButton special
        key={idx}
        onClick={() => this.handleClick('demo', idx)} 
        selected={this.state.demoIdx === idx}
      >{idx}</SelectionButton>      
    })

    const lessonButtons = this.state.lessons.map((l, idx) => {
      return <SelectionButton 
        key={idx}
        onClick={() => this.handleClick('lesson', idx)} 
        selected={this.state.lessonIdx === idx}        
        >{l.name}</SelectionButton>
    })

    return (
      <Layout>
        <Selection>
          <tbody>
            <tr>
              <ShortCell><Text>Time</Text></ShortCell>
              <td><QuestionMark style={{visibility: 'hidden'}} src={questionMark} /></td>
              <LongCell>{timeButtons}</LongCell>
            </tr>
            <tr>
              <ShortCell><Text>Level</Text></ShortCell>
              <td style={{verticalAlign: 'top'}}><QuestionMark onMouseOver={this.showHelpText.bind(this)} onMouseLeave={this.hideHelpText.bind(this)} src={questionMark} /></td>
              <LongCell>{levelButtons}</LongCell>
              <div style={{position: 'fixed', left: '50%', marginLeft: '-200px', width: '400px'}}>{this.state.showHelpText && <HelpText type={'difficultyExplanation'}/>}</div>
            </tr>
            <tr>
              <ShortCell><Text>Topic</Text></ShortCell>
              <td><QuestionMark style={{visibility: 'hidden'}} src={questionMark} /></td>
              <LongCell>{topicButtons}</LongCell>
            </tr>
            <tr>
              <ShortCell><Text>Demo</Text></ShortCell>
              <td><QuestionMark style={{visibility: 'hidden'}} src={questionMark} /></td>
              <LongCell>{demoButtons}</LongCell>
            </tr>
            {
              !_.isEmpty(this.state.lessons) &&
              <tr>
                <ShortCell><Text>Lesson</Text></ShortCell>
                <td><QuestionMark style={{visibility: 'hidden'}} src={questionMark} /></td>
                <LongCell>{lessonButtons}</LongCell>
              </tr>              
            }
          </tbody>
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

const Selection = styled.table`
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

// Refactor
const SelectionButton = Button.medium.extend`
  background-color: ${props => props.selected
    ? props.special ? color.green : color.red
    : color.lightestGray};
  color: ${props => props.selected ? 'white' : 'black'};
  margin: 0 0.5em 0.5em 0;
`

const ButtonContainer = styled.div`
  width: 100%;
  text-align: center;
`

const AccessCodeButton = Button.extraLarge.extend`
  background-color: ${color.blue};
  &:hover {
    background-color: ${color.blue10l};
  }
  font-size: 2.5em;
  height: 125px;
`

export default Settings;
