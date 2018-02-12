import { Redirect } from 'react-router';
import React, { Component } from 'react';
import styled from 'styled-components';
import queryString from 'query-string';
import _ from 'underscore';

import { shouldRedirect } from '../../../Library/helpers'
import { color } from '../../../Library/Styles/index';

class Read extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleClick(level) {
    const params = { type: 'read', id: level._id };
    this.setState({ redirect: '/play/' + queryString.stringify(params) });
  }

  render() {
    if (shouldRedirect(this.state, window.location)) { return <Redirect push to={this.state.redirect} />; }

    const button = level => {
      return <Button 
        key={level._id} 
        onClick={() => this.handleClick(level)}>
        {level.name.replace('Demo - ','')}
      </Button>
    }

    return (
      <div style={{width:'90%',margin:'0 auto',padding:'20px 0px'}}>
        {_.map(this.props.levels, button)}
      </div>
    );
  }
}

const Button = styled.div`
  text-align: center;
  background-color: ${color.mainBlue};
  color: white;
  text-transform: uppercase;
  font-family: BrandonGrotesqueBold;
  height: 50px;
  padding: 0px 20px;
  line-height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 30px;
  margin: 5px;
  display: inline-block;
  cursor: pointer;
`

export default Read
