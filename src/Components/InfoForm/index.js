import React, { Component } from 'react';
import styled from 'styled-components';

import TextAreas from '../TextAreas/index';
import lightGrayCheckmark from '../../Library/Images/Checkmark-LightGray.png';
import greenCheckmark from '../../Library/Images/Checkmark-Green.png';
import { color } from '../../Library/Styles/index';

class InfoForm extends Component {
  constructor(props) {
    super(props);

    const smallInputs = [
      { name: "firstName", placeholder: "first name", value: "" },
      { name: "lastName", placeholder: "last name", value: "" },
      { name: "email", placeholder: "email address", value: "" },
      { name: "school", placeholder: "school", value: "" }
    ]

    this.state = {
      smallInputs: smallInputs
    }
  }

  handleInputChange(event) {
    const updatedInputs = this.state.smallInputs.map((i) => {
      return i.name === event.target.name
        ? { name: i.name, placeholder: i.placeholder, value: event.target.value }
        : i
    });
    this.setState({ smallInputs: updatedInputs });
  }

  isValid(input) {
    return input.name === "email"
      ? this.isValidEmail(input.value)
      : input.value.length > 3
  }

  isValidEmail(email) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  render() {
    const smallInputs = this.state.smallInputs.map((input, idx) => {
      return <div key={idx} className="small-input">
        <img src={this.isValid(input) ? greenCheckmark : lightGrayCheckmark} className="checkmark" />
        <TextAreas.medium
          name={input.name}
          placeholder={input.placeholder}
          onChange={this.handleInputChange.bind(this)} />
      </div>
    });

    return (
      <Layout>
            <Text><Higlighted>WORDCRAFT</Higlighted> teaches the building blocks of English so students can analyze and navigate advanced vocabulary.</Text>
            <Text>To bring the curriculum to your school, fill out the following and we’ll be in touch as soon as possible.</Text>
          <form>
            <InputsContainer>
              {smallInputs}
              <TextAreas.medium name="comments" placeholder="comments" />
              <input type="submit" value="Submit" />
            </InputsContainer>
          </form>
      </Layout>
    );
  }
}

const Layout = styled.div`
  margin: auto;
  padding-top: 5%;
  width: 80%;
`

const Text = styled.p`
  font-size: 2em;
  text-align: center;
`

const InputsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`

const Higlighted = styled.span`
  color: ${color.yellow};
`

export default InfoForm;
