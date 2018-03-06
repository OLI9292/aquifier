import { Redirect } from 'react-router';
import queryString from 'query-string';
import _ from 'underscore';
import { connect } from 'react-redux'
import Firebase from '../../../Networking/Firebase';
import React, { Component } from 'react';
import styled from 'styled-components';
import get from 'lodash/get';

import { shouldRedirect } from '../../../Library/helpers'
import { color, media } from '../../../Library/Styles/index';
import InputStyles from '../../Common/inputStyles';
import Header from '../../Common/header';
import Button from '../../Common/button';

class JoinGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      placeholder: 'ex. 1324'
    };
  }

  entered(event) {
    const accessCode = event.target.value.trim();
    
    const isValid = this.isValid(accessCode);
    this.setState({ accessCode: accessCode, isValid: isValid });
  }

  isValid(accessCode) {
    return _.contains(_.range(1000, 10000), parseInt(accessCode, 10))
  }

  submit(accessCode) {
    if (this.state.isValid) {
      this.joinMatch(accessCode);
    } else {
      const error = 'Must be a 4-digit number between 1000 and 10000.'
      this.setState({ error });
    }
  }

  joinMatch = async accessCode => {
    const { user } = this.props;
    const name = `${get(user, 'firstName')} ${get(user, 'lastName')}`;

    const result = await Firebase.canEnterGame(name, accessCode);
    const canEnterMatch = result[0];
    
    if (!canEnterMatch) {
      this.setState({ error: result[1] });
    } else {
      const params = { type: 'multiplayer', id: accessCode };
      this.setState({ redirect: '/play/' + queryString.stringify(params) });
    }
  }  


  render() {
    if (shouldRedirect(this.state, window.location)) { return <Redirect push to={this.state.redirect} />; }    

    const submitStyles = _.extend({}, InputStyles.default,
      { display: 'block', margin: '0 auto', width: '180px', borderRadius: '40px', marginBottom: '15px' });

    return (
      <Container>
        <Header.small>
          access code
        </Header.small>

        <input
          onChange={event => this.entered(event)}
          onFocus={() => this.setState({ placeholder: '' })}
          type={'text'}
          placeholder={this.state.placeholder}
          style={submitStyles} />

        <Button.medium
          color={this.state.isValid ? color.mainBlue : color.lightGray} 
          onClick={() => this.submit(this.state.accessCode)}>
          submit
        </Button.medium>

        <ErrorMessage>
          {this.state.error}
        </ErrorMessage>
      </Container>
    );
  }
}

const Container = styled.div`
  text-align: center;
  padding: 20px 0px;
  position: relative;
  font-family: BrandonGrotesqueBold;
  ${media.phone`
    padding: 0;
    min-height: 80vh;
  `}; 
`

const ErrorMessage = styled.p`
  color: ${color.red};
  font-family: EBGaramond;
  display: ${props => props.hide ? 'none' : ''};
  font-size: 0.85em;
  margin-top: 30px;
`

const mapStateToProps = (state, ownProps) => ({
  session: state.entities.session,
  user: _.first(_.values(state.entities.user)),
  levels: _.values(state.entities.levels)
});

export default connect(mapStateToProps)(JoinGame);
