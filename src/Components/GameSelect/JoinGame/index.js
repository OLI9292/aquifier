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

class JoinGame extends Component {
  constructor(props) {
    super(props);
    this.state = {};
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

    return (
      <Container>
        <Header>
          access code
        </Header>

        <input
          onChange={event => this.entered(event)}
          type={'text'}
          placeholder={'ex. 1324'}
          style={_.extend(InputStyles.default, { textAlign: 'center', height: '45px', width: '150px' })} />

        <Submit
          color={this.state.isValid ? color.mainBlue : color.lightGray} 
          onClick={() => this.submit(this.state.accessCode)}>
          submit
        </Submit>

        <ErrorMessage>
          {this.state.error}
        </ErrorMessage>
      </Container>
    );
  }
}

const Header = styled.p`
  text-transform: uppercase;
  font-family: BrandonGrotesqueBold;
  letter-spacing: 1px;
  margin-top: 30px;
  margin-top: 30px;
`

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

const Submit = styled.p`
  margin: 0 auto;
  background-color: ${props => props.color};
  width: 150px;
  margin-top: 15px;
  cursor: pointer;
  height: 45px;
  color: white;
  border-radius: 5px;
  line-height: 45px;
  text-transform: uppercase;
  letter-spacing: 1px;
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
