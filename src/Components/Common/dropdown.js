import React, { Component } from 'react';
import styled from 'styled-components';
import _ from 'underscore';

class Dropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  handleSelect(choice) {
    this.props.handleSelect(choice);
    this.setState({ opened: false });
  }

  render() {
    const split = _.partition(this.props.choices, (c) => c === this.props.selected);
    const choices = _.union(split[0], split[1]);

    return (
      <div>
        {
          this.state.opened
          ?
          <div>
            {choices.map((c) => {
              return <p onClick={() => this.handleSelect(c)}>{c}</p>;
            })}
          </div>
          :
          <p onClick={() => this.setState({ opened: true })}>{choices[0]}</p>
        }
      </div>
    );
  }
}

export default Dropdown;
