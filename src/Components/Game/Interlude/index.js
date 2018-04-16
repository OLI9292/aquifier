import _ from 'underscore';
import { connect } from 'react-redux'
import React, { Component } from 'react';
import styled from 'styled-components';
import get from 'lodash/get';
import chunk from 'lodash/chunk';

import { color, media } from '../../../Library/Styles/index';
import arrow from '../../../Library/Images/arrow-in-circle.png';
import greenArrow from '../../../Library/Images/arrow-in-circle-green.png';

import {
  fetchImageAction
} from '../../../Actions/index';

import {
  ImageContainer,
  Citation,
  Arrow,
  Container,
  FactoidContainer,
  FactoidTextContainer,
  FactoidText
} from './components';

class Interlude extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  async componentWillReceiveProps(nextProps) {
    const {
      word,
      factoids,
      imageKeys,
      level
    } = nextProps;
    
    this.checkSize();    
    
    if (word === this.state.word) { return; }
    
    this.setState(
      { 
        word: word,
        currentPage: 1,
        factoid: null,
        factoidImageSource: null,
        imageSource: null,
        pages: 1
      }, 
      () => this.getContent(word, level, factoids, imageKeys)
    );
  }

  getContent(word, questionDifficulty, factoids, imageKeys) {
    const factoid = _.find(_.shuffle(factoids), f => f.words.includes(word));
    const imageKey = _.find(imageKeys, key => key.replace(".jpg","") === word);

    if (factoid/*&& factoid.level === questionDifficulty*/) {
      this.setFactoid(factoid);
    } else if (imageKey) {
      this.setImage(imageKey);
    }
  }

  fetchImage = async key => {
    const query = "key=" + key;
    const result = await this.props.dispatch(fetchImageAction(query));
    if (result.error || !get(result.response.entities, 'image')) { return; }
    return result.response.entities.image.source;
  }

  setFactoid = async factoid => {
    const factoidImageSource = factoid.imageSource && (await this.fetchImage(factoid.imageSource));
    // It's possible the response from the earlier of 2 requests arrives later, thus showing the wrong factoid
    if (!factoid.words.includes(this.state.word)) { return; }
    this.setState({ factoid: factoid, factoidImageSource: factoidImageSource });
    this.props.factoidReady();
  }

  setImage = async imageKey => {
    const imageSource = await this.fetchImage(imageKey);
    if (imageSource) { this.setState({ imageSource }); }
  }

  checkSize() {
    if (this.props.mobile || this.state.currentPage !== 1) { return; }
    const containerHeight = get(document.getElementById("factoidContainer"), "clientHeight");
    const textHeight = get(document.getElementById("factoidText"), "clientHeight") * 1.1;
    if (textHeight > containerHeight) {
      const pages = parseInt((textHeight / containerHeight), 10) + 1;
      this.setState({ pages: pages, currentPage: 1 });
    }
  }

  render() {
    if (!this.props.display) { return null; }
    
    const {
      currentPage,
      imageSource,
      factoid,
      factoidImageSource,
      pages
    } = this.state;

    const span = (word, idx) => {
      const stripped = word.replace(/\W/g, '');
      const styles = { color:color.yellow, fontFamily:"BrandonGrotesqueBold" };
      if (factoid.words.includes(stripped)) {
        return <span key={idx} style={styles}>{word}</span>
      } else if (factoid.excludedWords.includes(stripped)) {
        return <span key={idx} style={_.without(styles, "fontFamily")}>{word}</span>
      }
      return word;
    }

    const factoidContent = () => {
      const highlighted = factoid.value.split(" ")
        .map((word, idx) => span(word, idx));

      const [canPageDown, canPageUp] = [currentPage < pages, currentPage > 1];

      const chunked = pages && 
        (canPageUp ? [". . ."] : []).concat(
        chunk(highlighted, highlighted.length / pages)[currentPage - 1]).concat(
        canPageDown ? [". . ."] : []);
        
      const joined = (chunked || highlighted).reduce((prev, curr) => [prev, " ", curr]);

      const navigation = <div style={{marginLeft:'25px'}}>
        <Arrow
          onClick={() => this.setState({ currentPage: currentPage - 1 })}
          interactable={canPageUp}
          src={canPageUp ? greenArrow : arrow} />
        <Arrow
          down
          onClick={() => this.setState({ currentPage: currentPage + 1 })}
          interactable={canPageDown}
          src={canPageDown ? greenArrow : arrow} />              
      </div>;        

      const citation = (!pages || !canPageDown) && factoid.citation && <Citation>
        {factoid.citation}
      </Citation>;

      const hasImage = _.isString(factoidImageSource);

      const imgStyle = {height:"auto",width:"auto",maxWidth:"40%",maxHeight:"40%"};
      if (this.props.mobile) { imgStyle.margin = "20px 0px"; }

      return <div style={{height:"100%",display:"flex",alignItems:"center"}}>
        <FactoidContainer hide={!this.props.display} mobile={this.props.mobile} id="factoidContainer">
          {
            hasImage && 
            <img
              style={imgStyle}
              src={factoidImageSource} />
          }
          <FactoidTextContainer>
            <FactoidText
              hasImage={hasImage}
              mobile={this.props.mobile}
              id="factoidText">
              {joined}
              {citation}
            </FactoidText>
            {pages > 1 && navigation}
          </FactoidTextContainer>
        </FactoidContainer>
      </div>;
    }


    const imageContent = <ImageContainer>
      <img
        mobile={this.props.mobile}
        style={{height:"auto",width:"auto",maxWidth:"100%",maxHeight:"100%"}}
        src={imageSource} />
    </ImageContainer>;

    return factoid
      ? factoidContent()
      : imageSource ? imageContent : null;
  }
}

export default connect()(Interlude);
