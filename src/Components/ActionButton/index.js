import React, { Component } from 'react';
import { Redirect } from 'react-router';
import './index.css';
import ButtonType from '../../Models/ButtonType';

class ActionButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: false,
      isDownloadLink: props.type === 'download'
    };

    this.handleOnClick = this.handleOnClick.bind(this);
  }

  handleOnClick() {
    this.setState({ redirect: true });
  }

  render() {
    const buttonType = ButtonType[this.props.type];
    const downloadLink = "https://itunes.apple.com/us/app/wordcraft-vocabulary-from-greek-and-latin-roots/id1247708707?mt=8";

    const buttonContent = () => {
      return this.state.isDownloadLink
        ? <a href={downloadLink} target="blank"><p>{buttonType.text}</p></a>
        : <p>{buttonType.text}</p>
    }

    if (!this.state.isDownloadLink && this.state.redirect) {
      return <Redirect push to={buttonType.redirect} />;
    }

    return (
      <div className="action-button" style={{backgroundColor: buttonType.color}} onClick={this.handleOnClick}>
        {buttonContent()}
      </div>
    );
  }
}

export default ActionButton;
