import { connect } from 'react-redux'
import React, { Component } from 'react';
import { Redirect } from 'react-router';
import _ from 'underscore';

import Button from '../Common/button';
import { color } from '../../Library/Styles/index';
import { shouldRedirect } from '../../Library/helpers';

class GameOver extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    if (shouldRedirect(this.state, window.location)) { return <Redirect push to={this.state.redirect} />; }

    return (
      <div style={{width:'60%',margin:'0 auto',textAlign:'center',paddingTop:'25px'}}>
        
        <p style={{fontSize:'3em',marginTop:'25px'}}>
          <span style={{color:color.blue}}>{this.props.name}</span> Complete!
        </p>

        {
          this.props.score > 0 && 
          <h1>
            {`You scored ${this.props.score}`}.
          </h1>
        }

        {
          !this.props.user &&
          <div style={{color:color.darkGray}}>
            <p style={{fontSize:'2em'}}>
              Thanks for trying <span style={{color: color.yellow}}><b>WORDCRAFT!</b></span>
            </p>
            <p style={{fontSize:'1.5em'}}>
              Create an account for the full curriculum, progress tracking, and in-class multiplayer games.
            </p>
            <Button.medium
              onClick={() => this.setState({ redirect: '/startfreetrial' })} 
              color={color.green}
              style={{marginTop:'25px'}} >
              Start Free Trial
            </Button.medium>
          </div>
        }

        <Button.medium
          onClick={() => this.setState({ redirect: '/play' })}
          style={{marginTop:'25px'}} color={color.blue} >
          Home
        </Button.medium>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  user: _.first(_.values(state.entities.user))
});

export default connect(mapStateToProps)(GameOver)