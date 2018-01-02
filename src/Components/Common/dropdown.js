import React, { Component } from 'react';
import styled from 'styled-components';
import _ from 'underscore';
import { color } from '../../Library/Styles/index';
import arrow from '../../Library/Images/white-arrow-down.png';

class Dropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  handleSelect(choice) {
    this.props.handleSelect(choice);
    this.setState({ opened: false });
  }

  render() {
    const choices = _.union(..._.partition(this.props.choices, (c) => c === this.props.selected));

    return (
      <div style={{display:'inline-block',verticalAlign:'top',width:'140px'}}>
        {
          this.state.opened
          ?
          <ChoicesContainer>
            {choices.map((c) => <Button key={c} onClick={() => this.handleSelect(c)}>{c}</Button>)}
          </ChoicesContainer>
          :
          <Button selected onClick={() => this.setState({ opened: true })}>
            {choices[0]}
            <img src={arrow} alt={'down arrow'} style={{height:'45%',margin:'12px 0px 0px 5px'}} />
          </Button>
        }
      </div>
    );
  }
}

const Button = styled.p`
  background-color: ${props => props.selected ? color.blue : 'white'};
  color: ${props => props.selected ? 'white' : 'black'};
  cursor: pointer;
  justify-content: left;
  display: flex;
  border-radius: 5px;
  line-height: 50px;
  margin: 0;
  padding-left: 10px;
  height: 50px;
  width: 125px;
  font-size: 1.1em;
  transition-duration: 0.2s;
  &:hover {
    color: ${props => props.selected ? 'white' : color.green};
  }
`

const ChoicesContainer = styled.div`
  position: absolute;
  border: 5px solid ${color.lightestGray};
  border-radius: 5px;
`

export default Dropdown;
