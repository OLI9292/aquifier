import React, { Component } from 'react';
import './index.css';
import lightGrayCheckmark from '../../assets/images/Checkmark-LightGray.png';
import greenCheckmark from '../../assets/images/Checkmark-Green.png';
import ActionButton from '../ActionButton/index';

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
    const smallInputs = this.state.smallInputs.map((input) => {
      return <div className="small-input">
        <img src={this.isValid(input) ? greenCheckmark : lightGrayCheckmark} className="checkmark" />
        <input name={input.name} placeholder={input.placeholder} onChange={this.handleInputChange.bind(this)} />
      </div>
    });

    return (
      <div className="form-container">
        <div className="form-header">
          <p>WORDCRAFT teaches the building blocks of English so students can analyze and navigate advanced vocabulary.</p>
          <br />
          <p>To bring Wordcraft to your school, fill out the following  and we’ll be in touch as soon as possible.</p>
        </div>
        <form>
          <div className="small-inputs">
            {smallInputs}
          </div>
          <input name="comments" placeholder="comments" />
          <input type="submit" value="Submit" />
        </form>
        <div className="action-buttons">
          <ActionButton type="play" />
          <ActionButton type="download" />
        </div>
      </div>
    );
  }
}

export default InfoForm;
