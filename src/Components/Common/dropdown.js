import React, { Component } from 'react';
import styled from 'styled-components';
import _ from 'underscore';
import { color } from '../../Library/Styles/index';

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
    const choices = _.union(..._.partition(this.props.choices, (c) => c === this.props.selected));

    return (
      <div style={{display:'inline-block',verticalAlign:'top',margin:'0px 5px 0px 5px'}}>
        {
          this.state.opened
          ?
          <div>
            {choices.map((c) => {
              return <Button onClick={() => this.handleSelect(c)}>{c}</Button>;
            })}
          </div>
          :
          <Button selected onClick={() => this.setState({ opened: true })}>{choices[0]}</Button>
        }
      </div>
    );
  }
}

const Button = styled.h3`
  background-color: ${props => props.selected ? color.blue : color.lightestGray};
  color: ${props => props.selected ? 'white' : color.darkGray};
  cursor: pointer;
  border-radius: 5px;
  line-height: 50px;
  margin: 0;
  height: 50px;
  width: 125px;
`

export default Dropdown;
