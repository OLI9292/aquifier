import React, { Component } from 'react';
import './index.css';
import lightGrayCheckmark from '../../Library/Images/Checkmark-LightGray.png';
import greenCheckmark from '../../Library/Images/Checkmark-Green.png';
import ActionButton from '../Buttons/action';

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
      <div>
        <div className="form-container">
          <div className="form-header">
            <p><span className="brand">WORDCRAFT</span> teaches the building blocks of English so students can analyze and navigate advanced vocabulary.</p>
            <p>To bring <span className="brand">WORDCRAFT</span> to your school, fill out the following  and we’ll be in touch as soon as possible.</p>
          </div>
          <form>
            <div className="small-inputs">
              {smallInputs}
              <textarea name="comments" placeholder="comments" />
              <input type="submit" value="Submit" />
            </div>
          </form>
        </div>
        <div className="action-buttons">
          <ActionButton type="play" />
          <ActionButton type="download" />
        </div>
      </div>
    );
  }
}

export default InfoForm;
