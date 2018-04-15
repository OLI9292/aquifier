import _ from 'underscore';
import { connect } from 'react-redux'
import React, { Component } from 'react';
import styled from 'styled-components';
import get from 'lodash/get';
import chunk from 'lodash/chunk';

import { color, media } from '../../Library/Styles/index';
import { mobileCheck } from '../../Library/helpers';
import arrow from '../../Library/Images/arrow-in-circle.png';
import greenArrow from '../../Library/Images/arrow-in-circle-green.png';

import {
  fetchImageAction
} from '../../Actions/index';

class Interlude extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidMount() {
    this.setState({ mobile: mobileCheck() });
  }

  async componentWillReceiveProps(nextProps) {
    const {
      word,
      factoids,
      imageKeys
    } = nextProps;
    
    this.checkSize();    
    if (word === this.state.word) { return; }
    
    this.setState(
      { word: word, currentPage: 1, factoid: null, factoidImageSource: null, imageSource: null }, 
      () => this.getContent(word, factoids, imageKeys)
    );
  }

  getContent(word, factoids, imageKeys) {
    const factoid = _.find(_.shuffle(factoids), f => f.words.includes(word));
    const imageKey = _.find(imageKeys, key => key.replace(".jpg","") === word);

    if (factoid && imageKey) {
      Math.random() > 0.5 ? this.setFactoid(factoid) : this.setImage(imageKey);
    } else if (factoid || imageKey) {
      factoid ? this.setFactoid(factoid) : this.setImage(imageKey);
    }
  }

  fetchImage = async key => {
    const query = "key=" + key;
    const result = await this.props.dispatch(fetchImageAction(query));
    if (result.error || !get(result.response.entities, 'image')) { return; }
    return result.response.entities.image.source;
  }

  setFactoid = async factoid => {
    //const factoid = _.find(this.props.factoids, f => f.words.includes("biology"))
    const factoidImageSource = factoid.imageSource && (await this.fetchImage(factoid.imageSource));
    this.setState({ factoid: factoid, factoidImageSource: factoidImageSource });
    this.props.displayingFactoid();
  }

  setImage = async imageKey => {
    const imageSource = await this.fetchImage(imageKey);
    if (imageSource) { this.setState({ imageSource }); }
  }

  checkSize() {
    if (this.state.mobile || this.state.currentPage !== 1) { return; }
    const containerHeight = get(document.getElementById("factoidContainer"), "clientHeight");
    const textHeight = get(document.getElementById("factoidText"), "clientHeight") * 1.25;
    if (textHeight > containerHeight) {
      const pages = parseInt((textHeight / containerHeight), 10) + 1;
      this.setState({ pages: pages, currentPage: 1 });
    }
  }

  render() {
    const {
      currentPage,
      imageSource,
      factoid,
      factoidImageSource,
      mobile,
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

      const navigation = () => {
        return <ArrowContainer>
          <Arrow
            onClick={() => this.setState({ currentPage: currentPage - 1 })}
            interactable={canPageUp}
            src={canPageUp ? greenArrow : arrow} />
          <Arrow
            down
            onClick={() => this.setState({ currentPage: currentPage + 1 })}
            interactable={canPageDown}
            src={canPageDown ? greenArrow : arrow} />              
        </ArrowContainer>;        
      }

      const citation = (!pages || !canPageDown) && factoid.citation && <Citation>
        {factoid.citation}
      </Citation>;

      const hasImage = _.isString(factoidImageSource);

      return <div style={{height:"100%",display:"flex",alignItems:"center"}}>
        <FactoidContainer hide={!this.props.display} mobile={mobile} id="factoidContainer">
          {hasImage && <Image
            mobile={mobile}
            factoid
            marginRight
            src={factoidImageSource} />}
          <FactoidTextContainer>
            <FactoidText
              hasImage={hasImage}
              mobile={mobile}
              id="factoidText">
              {joined}
              {citation}
            </FactoidText>
            {pages && navigation()}
          </FactoidTextContainer>
        </FactoidContainer>
      </div>;
    }

    const imageContent = <ImageContainer hide={!this.props.display}>
      <Image src={imageSource} />
    </ImageContainer>;

    return factoid
      ? factoidContent()
      : imageSource ? imageContent : <div />;
  }
}

const ArrowContainer = styled.div`
  margin-left: 25px;
`

const ImageContainer = styled.div`
  height: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  display: ${props => props.hide && "none"}
`

const Citation = styled.span`
  font-size: 0.9em;
  margin-top: 10px;
  color: ${color.gray2};
  text-align: right;
  display: block;
`

const Arrow = styled.img`
  transform: ${props => props.down && 'scale(1, -1)'};
  margin-top: ${props => props.down && '15px'};
  pointer-events: ${props => props.interactable ? 'auto': 'none'};
  cursor: ${props => props.interactable && 'pointer'};
  height: 50px;
  width: 50px;
  box-shadow: 0 0 10px rgba(0,0,0,0.25);
  border-radius: 50%;
`

const Container = styled.div`
  text-align: center;
  height: 100%;
  width: 100%;
`

const Image = styled.img`
  max-height: ${props => props.factoid ? 40 : 100}%;
  max-width: ${props => (props.factoid || props.mobile) ? 100 : 40}%;
  height: auto;
  width: auto;
`

const FactoidContainer = styled.div`
  display: ${props => props.hide ? "none" : !props.mobile && "flex"};
  justify-content: space-between;
  align-items: center;
  width: 90%;
  margin: 0 auto;
  height: ${props => props.mobile ? "100%" : "80%"};
  width: 80%;
  text-align: ${props => props.mobile && "center"};
`

const FactoidTextContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const FactoidText = styled.p`
  font-size: 1.5em;
  text-align: left;
  padding-left: ${props => !props.mobile && "10%"};
  margin: ${props => props.mobile && `${props.hasImage ? 0 : "15px"} 5% 75px 5%`};
`

export default connect()(Interlude);
