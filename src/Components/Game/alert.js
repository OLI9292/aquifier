import _ from 'underscore';
import React, { Component } from 'react';
import { color } from '../../Library/Styles/index';

import {
  AlertContainer,
  AlertImage,
  AlertText
} from './components';

const alerts = {
  speedy: {
    name: 'speedy!',
    color: color.red,
    image: require('../../Library/Images/speedy.png')
  },
  passed: {
    name: 'passed',
    color: color.green,
    image: require('../../Library/Images/Checkmark-Green.png')
  },
  correct: {
    name: 'correct!',
    color: color.warmYellow,
    image: require('../../Library/Images/star-yellow.png')
  }
};

class Alert extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    this.timeouts = [];
  }

  clearTimeouts() {
    _.forEach(this.timeouts, clearTimeout);
  }

  componentWillUnmount() {
    this.clearTimeouts();
  }  

  componentWillReceiveProps(nextProps) {
    if (_.isEqual(this.props.data, nextProps.data)) { return; }

    if (_.isEmpty(nextProps.data)) {
      this.setState({ type: null }, this.clearTimeouts);
      return;
    }

    const { correct, speedy } = nextProps.data;
 
    if (speedy) {
      this.setAlert('speedy', 0);
      this.setAlert(undefined, 1100);
    };

    const correctAlert = correct ? 'correct' : 'passed';
    this.setAlert(correctAlert, speedy ? 1300 : 0);
    this.setAlert(undefined, speedy ? 2400 : 1100);
  }

  setAlert(type, time) {
    this.timeouts.push(setTimeout(() => { this.setState({ type }); }, time));
  }

  render() {
    const alert = alerts[this.state.type];
    
    if (!alert) {
      return <AlertContainer />;
    }

    return (
      <AlertContainer>
        <AlertImage 
          src={alert.image} />              
        <AlertText color={alert.color}>
          {alert.name}
        </AlertText>
      </AlertContainer>
    );
  }
}

export default Alert;
