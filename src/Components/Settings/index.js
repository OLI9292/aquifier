import React, { Component } from 'react';
import Header from '../Header/index';
import styled from 'styled-components';
import { color } from '../../Assets/Styles/index';
import _ from 'underscore';

class Settings extends Component {
  constructor(props) {
    super(props);

    this.state = { 
      timeIdx: 0,
      levelIdx: 0,
      topicIndices: [0]
    };

    this.handleClick = this.handleClick.bind(this);
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
    }
  }

  render() {

    const TIMES = ['3 Minutes', '5 Minutes'];
    const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
    const TOPICS = ['Everything', 'Math', 'Nature', 'History', 'Science'];

    const timeButtons = TIMES.map((t, idx) => {
      return <Button 
        onClick={() => this.handleClick('time', idx)} 
        selected={this.state.timeIdx === idx}
      >{t}</Button>
    });

    const levelButtons = LEVELS.map((l, idx) => {
      return <Button 
        onClick={() => this.handleClick('level', idx)} 
        selected={this.state.levelIdx === idx}
      >{l}</Button>
    });

    const topicButtons = TOPICS.map((t, idx) => {
      return <Button 
        onClick={() => this.handleClick('topic', idx)} 
        selected={_.contains(this.state.topicIndices, idx)}
      >{t}</Button>
    });

    return (
      <OuterFrame>
        <Header />
        <InnerFrame>
          <Selection>
            <Group>
              <Text>Time</Text>
              {timeButtons}
            </Group>
            <Group>
              <Text>Level</Text>
              {levelButtons}
            </Group>
            <Group>
              <Text>Topic</Text>
              {topicButtons}
            </Group>
          </Selection>
        </InnerFrame>
      </OuterFrame>
    );
  }
}

const OuterFrame = styled.div`
  background-color: ${color.lightestGray};
  width: 100%;
  height: 100%;
`

const InnerFrame = styled.div`
  width: 80%;
  margin: auto;
  margin-top: 25px;
  background-color: white;  
  border-radius: 10px;
`

const Selection = styled.div`
  padding-top: 5px;
  margin-left: 20px;
`

const Group = styled.div`
`

const Text = styled.h4`
  font-size: 2em;
  font-style: bold;
  display: inline-block;
  margin-right: 10px;
`

const Button = styled.button`
  &:focus {
    outline: 0;
  }
  border-radius: 10px;
  border-width: 0px;
  cursor: pointer;
  font-family: BrandonGrotesque;
  display: inline-block;
  background-color: ${props => props.selected ? color.red : color.lightestGray};
  color: ${props => props.selected ? 'white' : 'black'};
  font-size: 2em;
  margin-left: 20px;
`

export default Settings;
