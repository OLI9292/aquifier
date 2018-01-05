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
    this.setState({ open: false });
  }

  render() {
    const choices = _.union(..._.partition(this.props.choices, (c) => c === this.props.selected));

    return (
      <Container open={this.state.open}>
        {
          choices.map((c, i) => {
            const display = this.state.open || i === 0;
            const selected = !this.state.open && i === 0

            return <Button
              display={display}
              selected={selected}
              key={c} 
              onClick={() => this.state.open ? this.handleSelect(c) : this.setState({ open: true })}>
              {c}
              <img 
                alt={'down arrow'} 
                src={arrow} 
                style={{height:'45%',margin:'12px 0px 0px 5px'}} />
            </Button>;
          })
        }
      </Container>
    );
  }
}

const Button = styled.p`
  display: ${props => props.display ? 'flex' : 'none'};
  background-color: ${props => props.selected ? color.blue : 'white'};
  color: ${props => props.selected ? 'white' : 'black'};
  cursor: pointer;
  justify-content: left;
  border-radius: 5px;  
  line-height: 50px;
  margin: 0;
  padding: 0px 20px 0px 10px;
  height: 50px;
  font-size: 1.1em;
  transition-duration: 0.2s;
  &:hover {
    color: ${props => props.selected ? 'white' : color.green};
  }
`

const Container = styled.div`
  border: 5px solid ${props => props.open ? color.lightestGray : 'white'};
  border-radius: 5px;
`

export default Dropdown;
