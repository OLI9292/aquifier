import { connect } from 'react-redux'
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import { Redirect } from 'react-router';
import styled from 'styled-components';
import _ from 'underscore';
import Firebase from '../../Networking/Firebase';

import Textarea from '../Common/textarea';
import { color } from '../../Library/Styles/index';
import { lighten10 } from '../../Library/helpers';
import { shouldRedirect } from '../../Library/helpers'

import { fetchLevels } from '../../Actions/index';

class GameSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.dispatch(fetchLevels());
  }

  componentWillReceiveProps(nextProps) {
    const levels = nextProps.levels;
    if (levels && !this.state.levels) { this.setState({ levels }); }
  }  

  render() {
    if (shouldRedirect(this.state, window.location)) { return <Redirect push to={this.state.redirect} />; }

    const speedRoundButtons = _.map(_.range(1, 11), level => {
      const params = queryString.stringify({ type: 'speed', id: level })
      return <Link key={level} style={{textDecoration:'none',color:'white'}} to={'/play/' + params}>
        <Button>
          {level}
        </Button>
      </Link>
    })


    const demoButtons = _.map(_.range(1, 5), level => {
      const params = queryString.stringify({ type: 'demo', id: level })
      return <Link key={level} style={{textDecoration:'none',color:'white'}} to={'/play/' + params}>
        <Button>
          {level}
        </Button>
      </Link>
    })    

    const levelButton = level => {
      const params = queryString.stringify({ type: 'train', id: level._id })
      return <Link key={level._id} style={{textDecoration:'none',color:'white'}} to={'/play/' + params}>
        <Button>
          {level.name}
        </Button>
      </Link>      
    }

    return (
      <Container>
        <h2 style={{textAlign:'center'}}>
          Demo
        </h2>    
        {demoButtons}
        <h2 style={{textAlign:'center'}}>
          Train
        </h2>    
        {this.state.levels && _.map(this.state.levels, levelButton)}  
        <h2 style={{textAlign:'center'}}>
          Speed Rounds
        </h2>
        {speedRoundButtons}
      </Container>
    );
  }
}

const Container = styled.div`
  padding: 25px 0px;
`

const Button = styled.div`
  height: 50px;
  width: 50px;
  margin: 0 auto;
  cursor: pointer;
  background: ${color.red};
  text-align: center;
  line-height: 50px;
  border-radius: 25px;
  margin-top: 10px;
  margin-bottom: 10px;
`

const mapStateToProps = (state, ownProps) => ({
  session: state.entities.session,
  user: _.first(_.values(state.entities.user)),
  levels: _.values(state.entities.levels)
});

export default connect(mapStateToProps)(GameSelect);
