import { connect } from 'react-redux'
import React, { Component } from 'react';
import { Redirect } from 'react-router';
import styled from 'styled-components';
import _ from 'underscore';

import Button from '../Common/button';
import Link from '../Common/link';
import lockPng from '../../Library/Images/lock.png';
import { color } from '../../Library/Styles/index';
import { loadLessons } from '../../Actions/index';
import { shouldRedirect } from '../../Library/helpers'

class ReadingGameSelect extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lessons: []
    };
  }

  async componentDidMount() {
    if (this.props.lessons.length) {
      this.setState({ loaded: true, selected: this.props.lessons[0]._id });
    } else {
      this.props.dispatch(loadLessons());
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.loaded && nextProps.lessons.length) {
      this.setState({ loaded: true, selected: nextProps.lessons[0]._id });
    }
  }

  render() {
    if (shouldRedirect(this.state, window.location)) { return <Redirect push to={this.state.redirect} />; }

    const lessons = (() => {
      return <div style={{textAlign:'center',width:'90%',margin:'0 auto'}}>
        {
          this.props.lessons.map((l, i) => {
            return l.name.startsWith("Demo") || this.props.user
            ?
            <LessonButton key={i}
              onClick={() => this.setState({ selected: l._id })}
              selected={l._id === this.state.selected}>
              {l.name}
            </LessonButton>
            :
            <LessonButton key={i}
              locked
              onClick={() => this.setState({ redirect: '/startfreetrial' })}
              selected={l._id === this.state.selected}>
              <Image style={{height: '16px',marginRight:'5px'}} src={lockPng} />
              {l.name}
            </LessonButton>
            })
        }
      </div>
    })();

    return (
      <div style={{width:'95%',margin:'0 auto',paddingTop:'25px'}}>
        <Link.large onClick={() => this.setState({ redirect: '/play' })} color={color.blue}>
          Back
        </Link.large>
        
        <Header>
          Choose a Reading
        </Header>

        {lessons}

        {
          !_.isEmpty(this.props.lessons) && 
          <div style={{textAlign:'center',marginTop:'50px'}}>
            <Button.medium color={color.blue} 
              onClick={() => this.setState({ redirect: `/play/reading=${this.state.selected}` })}>
              Continue
            </Button.medium>
          </div>
        }
      </div>
    );
  }
}

const Header = styled.p`
  font-size: 3em;
  text-align: center;
  margin-top: -50px;
`

const Image = styled.img`
  height: 100%;
  width: auto;
`

const LessonButton = Button.mediumLong.extend`
  color: ${props => props.locked
    ? color.gray
    : props.selected ? 'white' : 'black'
  };
  height: 80px;
  background-color: ${props => props.selected ? color.green : color.lightestGray};
  margin: 0.5em;
  vertical-align: top;
  &:hover {
    background-color: ${color.green};
    color: white;
  }
`

const mapStateToProps = (state, ownProps) => ({
  lessons: _.values(state.entities.lessons),
  user: _.first(_.values(state.entities.user))
})

export default connect(mapStateToProps)(ReadingGameSelect)
