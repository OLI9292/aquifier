import _ from 'underscore';
import React, { Component } from 'react';
import styled from 'styled-components';

import arrow from '../../Library/Images/white-arrow-down.png';
import { color } from '../../Library/Styles/index';

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
            const show = this.state.open || i === 0;
            const selected = !this.state.open && i === 0

            return <Button
              open={this.state.open}
              show={show}
              selected={selected}
              key={c}
              onMouseOver={() => this.setState({ open: true })}
              onMouseLeave={() => this.setState({ open: false })} 
              onClick={() => this.setState({ open: false }, () => this.handleSelect(c))}>
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

const Container = styled.div`
  border: 5px solid ${props => props.open ? color.lightGray : color.blue};
  border-radius: 5px;
  height: ${props => props.open ? '' : '45px'};
`

const Button = styled.p`
  border: 5px solid ${props => props.open ? 'white' : color.blue};
  display: ${props => props.show ? 'flex' : 'none'};
  background-color: ${props => props.selected ? color.blue : 'white'};
  color: ${props => props.selected ? 'white' : 'black'};
  cursor: pointer;
  justify-content: left;
  line-height: 35px;
  margin: 0;
  padding: 0px 20px 0px 10px;
  height: 35px;
  transition-duration: 0.2s;
  &:hover {
    color: ${props => props.selected ? 'white' : color.green};
  }
`

export default Dropdown;
