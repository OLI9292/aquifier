import { Redirect } from 'react-router';
import React, { Component } from 'react';
import styled from 'styled-components';
import queryString from 'query-string';
import _ from 'underscore';

import { shouldRedirect } from '../../../Library/helpers'
import { color } from '../../../Library/Styles/index';

class Explore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      levels: []
    };
  }

  componentDidMount() {
    this.loadLevels(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.loadLevels(nextProps)
  }

  loadLevels(props) {
    if (props.levels.length && _.isEmpty(this.state.levels)) {
      const levels = this.formatLevels(props.levels, props.user);
      const categories = _.keys(levels);
      this.setState({ categories: categories, levels: levels }); 
    }
  }

  formatLevels(allLevels, user) {
    const exploreLevels = _.filter(allLevels, l => !l.isStudy);
    return _.groupBy(exploreLevels, l => l.name.split(' ')[0]);
  }

  handleClick(name) {
    if (this.state.category) {
      const level = _.find(_.flatten(_.values(this.state.levels)), l => l.name === name);
      if (level) {
        const words = _.pluck(level.questions, 'word').join(',');
        const params = { type: 'explore', words: words };
        this.setState({ redirect: '/play/' + queryString.stringify(params) });
      }
    } else {
      this.setState({ category: name });
    }
  }

  render() {
    if (shouldRedirect(this.state, window.location)) { return <Redirect push to={this.state.redirect} />; }

    const button = name => {
      return <Button 
        key={name} 
        onClick={() => this.handleClick(name)}>
        {name}
      </Button>
    }

    const buttonsFor = category => {
      const levels = _.pluck(this.state.levels[category], 'name').sort();
      return _.map(levels, button)
    }

    return (
      <div style={{width:'90%',margin:'0 auto',padding:'20px 0px'}}>
        {
          this.state.category
          ? buttonsFor(this.state.category)
          : _.map(this.state.categories, button)
        }
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
  padding: 0px 20px;
  height: 50px;
  line-height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 30px;
  margin: 5px;
  display: inline-block;
  cursor: pointer;
`

export default Explore
