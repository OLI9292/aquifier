import { connect } from 'react-redux'
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import _ from 'underscore';

import { color, media } from '../../Library/Styles/index';

class Welcome extends Component {

  render() {
    return (
      <Container>
        <p style={{fontSize:'2.75em',color:color.yellow}}>
          WORDCRAFT
        </p>

        <p style={{fontSize:'1.75em',margin:'0'}}>
          Your free Wordcraft membership has begun!
        </p>

        <br />

        <p style={{fontSize:'1.75em',margin:'0'}}>
          Check your email for account information.
        </p>  
        
        <br />      

        <p style={{fontSize:'1.75em',margin:'0'}}>
          Contact <b>support@playwordcraft.com</b> if you have any questions.
        </p>        
      </Container>
    );
  }
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: white;
  border-radius: 20px;
  min-height: 70vh;
  text-align: center;
  padding-bottom: 20px;
  ${media.phone`
    font-size: 0.9em;
    min-height: 90vh;
  `};    
`

const mapStateToProps = (state, ownProps) => ({
  session: state.entities.session,
  user: _.first(_.values(state.entities.user))
})

export default connect(mapStateToProps)(Welcome)
