import React, { Component } from 'react';
import { Redirect } from 'react-router';
import styled from 'styled-components';
import _ from 'underscore';

import Button from '../Common/button';
import Link from '../Common/link';
import { color } from '../../Library/Styles/index';
import Lesson from '../../Models/Lesson';
import lockPng from '../../Library/Images/lock.png';
import User from '../../Models/User';

class ReadingGameSelect extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: null,
      publicLessons: [],
      privateLessons: []
    };
  }

  async componentDidMount() {
    const userId = User.loggedIn('_id');
    if (userId === null) { return; }
    const result = await Lesson.forStudent(userId);
    const [publicLessons, privateLessons] = _.partition((result.data || []), (l) => l.public);
    const selected = publicLessons[0];
    if (selected) {
      const state = { publicLessons: publicLessons, selected: selected._id };
      if (userId) { state.privateLessons = privateLessons };
      this.setState(state);
    }
    if (userId) {
      this.setState({ loggedIn: true });
    }
  }

  render() {
    if (this.state.redirect && !window.location.href.endsWith(this.state.redirect)) {
      return <Redirect push to={this.state.redirect} />;
    }

    const readings = (type) => {
      const lessons = type === 'public' ? this.state.publicLessons : this.state.privateLessons;
      if (lessons.length) {
        return <LessonsContainer>
          {
            lessons.map((l, i) => {
              const isEnabled = (l.name.startsWith("Demo") || this.state.loggedIn);
              if (isEnabled) {
                return <LessonButton onClick={() => this.setState({ selected: l._id })}
                  selected={l._id === this.state.selected} key={i}
                >{l.name}</LessonButton>
              } else {
                return <LessonButtonDisabled onClick={() => this.setState({ redirect: '/startfreetrial' })}
                  selected={l._id === this.state.selected} key={i}
                ><Image style={{height: '16px',marginRight:'5px'}} src={lockPng} />{l.name}</LessonButtonDisabled>
              }
            })
          }
        </LessonsContainer>
      }
    }

    return (
      <div style={{width:'95%',margin:'0 auto',paddingTop:'25px'}}>
        <Link.large onClick={() => this.setState({ redirect: '/play' })} color={color.blue}>
          Back
        </Link.large>
        <Header>Choose a Reading</Header>
        {readings('private')}
        {readings('public')}
        {!_.isEmpty(this.state.publicLessons) && <div style={{textAlign:'center',marginTop:'50px'}}>
          <Button.medium color={color.blue} onClick={() => this.setState({ redirect: `/play/reading=${this.state.selected}` })}>Continue</Button.medium>
        </div>}
      </div>
    );
  }
}

const Header = styled.p`
  font-size: 3em;
  text-align: center;
  margin-top: -50px;
`

const LessonsContainer = styled.div`
  text-align: center;
  width: 90%;
  margin: 0 auto;
`

const Image = styled.img`
  height: 100%;
  width: auto;
`

const LessonButton = Button.mediumLong.extend`
  color: ${props => props.selected ? 'white' : 'black'};
  height: 80px;
  background-color: ${props => props.selected ? color.green : color.lightestGray};
  margin: 0.5em;
  vertical-align: top;
  &:hover {
    background-color: ${color.green};
    color: white;
  }
`

const LessonButtonDisabled = LessonButton.extend`
  color: ${props => props.selected ? 'white' : 'grey'};
`

export default ReadingGameSelect;
