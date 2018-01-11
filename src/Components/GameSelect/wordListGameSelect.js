import { connect } from 'react-redux'
import React, { Component } from 'react';
import { Redirect } from 'react-router';
import styled from 'styled-components';
import _ from 'underscore';

import Button from '../Common/button';
import Link from '../Common/link';
import { loadWordLists } from '../../Actions/index';
import { color } from '../../Library/Styles/index';
import { shouldRedirect } from '../../Library/helpers'

import whiteCheckmark from '../../Library/Images/Checkmark-White.png';
import greenCheckmark from '../../Library/Images/Checkmark-Green.png';
import studyPng from '../../Library/Images/study-color.png';
import explorePng from '../../Library/Images/explore-color.png';
import lockPng from '../../Library/Images/lock.png';

const params = {
  study: {
    title: 'Study',
    description: 'Work your way up through the word lists.',
    color: color.blue,
    image: studyPng
  },
  explore: {
    title: 'Explore',
    description: 'Build knowledge in specific subjects.',
    color: color.green,
    image: explorePng
  }
}

const TIME_LIMITS = [3, 5];

class WordListGameSelect extends Component {
  constructor(props) {
    super(props);

    this.state = {
      step: 0,
      timeLimit: TIME_LIMITS[0]
    };
  }

  componentDidMount() {
    if (this.props.wordLists.length) {
      this.setState({ loaded: true }, () => this.setup(this.props.wordLists));
    } else {
      this.props.dispatch(loadWordLists());
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.wordLists.length && !this.state.loaded) {
      this.setState({ loaded: true }, () => this.setup(nextProps.wordLists));
    }
  }

  setup(wordLists) {
    const game = this.props.settings.game;
    const filtered = wordLists.filter((w) => game === 'study' ? w.isStudy : !w.isStudy);
    const reformatted = this.reformatWordLists(filtered);
    const selected = reformatted[_.keys(reformatted)[0]][0].id;
    const loggedIn = !_.isUndefined(this.props.user);
    this.setState({ loggedIn: loggedIn, wordLists: reformatted, selected: selected });
  }

  // Temporary solution until better data modeling is agreed on - @akiva, @oliver
  reformatWordLists(wordLists) {
    const completed = this.props.user ? this.props.user.wordListsCompleted : [];

    return _.groupBy(_.sortBy(wordLists
      .map((w) => {
        const split = w.name.split(' ');
        const [category, name] = [split.slice(0, split.length - 1).join(' '), parseInt(split[split.length - 1], 10)];
        const valid = split.length > 1 && Number.isInteger(name);
        return valid
          ? { 
              category: category, 
              completed: _.contains(completed, w._id),
              name: name,
              questions: w.questions,
              id: w._id
            }
          : null;
      })
      .filter((w) => w), 'name'), 'category')
  }

  continue(wordListId) {
    this.setState({ wordListId: wordListId, step: 1 });
  }

  play(timeLimit) {
    const gameLink = this.gameLink(timeLimit);
    if (gameLink) { this.setState({ redirect: gameLink }) } ;
  }

  gameLink(timeLimit) {
    const wordList = _.find(_.flatten(_.values(this.state.wordLists)), (w) => w.id === this.state.wordListId);

    if (wordList) {
      return this.props.settings.players === 'multi'
        ? `/admin/wordList=${wordList.id}&time=${timeLimit}`
        : `/play/players=${this.props.settings.players}&wordList=${wordList.id}&time=${timeLimit}`
    }
  }

  handleClickedBack() {
    if (this.state.step === 1) {
      this.setState({ step: 0 });
    } else {
      this.setState({ redirect: '/play' });
    }
  }

  render() {
    if (shouldRedirect(this.state, window.location)) { return <Redirect push to={this.state.redirect} />; }

    const p = params[this.props.settings.game];

    const wordListButton = (enabled, completed, selected, wordList) => {
      const content = (() => {
        if      (completed && selected) { return Button.imageAndText(whiteCheckmark, wordList.name); } 
        else if (completed)             { return Button.imageAndText(greenCheckmark, wordList.name); }
        else if (!enabled)              { return Button.imageAndText(lockPng, wordList.name); }
        else                            { return wordList.name; }
      })();

      const [fColor, bColor] = completed
        ? ['white', color.green] 
        : enabled ? ['black', color.lightestGray] : [color.gray, color.lightestGray];

      return <Button.small key={wordList.name} color={bColor}
        style={{color:fColor,margin:'5px',verticalAlign:'top'}}
        onClick={() => enabled ? this.continue(wordList.id) : this.setState({ redirect: '/startfreetrial'})}
      >{content}</Button.small>;
    }

    const wordListTable = () => {
      return <table style={{borderSpacing:'2em',textAlign:'left'}}>
        <tbody>
          {
            _.keys(this.state.wordLists).map((k,i) => {
              return <tr key={i}>
                <td style={{verticalAlign:'top',width:'125px',fontSize:'1.5em'}}>
                  <b>{k}</b>
                </td>
                <td>
                  {this.state.wordLists[k].map((wordList) => {
                    const enabled = ((_.contains([1,2], wordList.name) && !_.contains(["Advanced"], k)) || this.state.loggedIn);
                    const selected = this.state.selected === wordList.id;
                    return wordListButton(enabled, wordList.completed, selected, wordList);
                  })}
                </td>
              </tr>
            })
          }
        </tbody>
      </table>
    }

    const timeSelect = () => {
      return <table style={{borderSpacing:'2em',textAlign:'left'}}>
        <tbody>
        <tr>
          <td style={{verticalAlign:'top',width:'125px',fontSize:'1.5em'}}>
            <b>Time</b>
          </td>
          <td>
            {
              TIME_LIMITS.map((t,i) => {
                return <Button.small key={i} color={color.lightestGray}
                  style={{color:'black',margin:'0px 5px 0px 5px'}}
                  onClick={() => this.play(t)}
                >{`${t} Minutes`}</Button.small>
              })
            }
          </td>
          </tr>
        </tbody>
      </table>
    }

    return (
      <div style={{width:'95%',margin:'0 auto',paddingTop:'25px'}}>
        <Link.large onClick={() => this.handleClickedBack()} color={color.blue}>Back</Link.large>
        <div style={{display:'flex',alignItems:'center',height:'50px',justifyContent:'center',marginTop:'-40px'}}>
          <Image src={p.image} />
          <Title color={p.color}>{p.title}</Title>
        </div>
        <p style={{textAlign:'center',marginTop:'20px',fontSize:'1.4em'}}>{p.description}</p>
        {
          this.state.wordLists &&
          <div style={{textAlign:'center'}}>
            {this.state.step === 0 ? wordListTable() : timeSelect()}
          </div>
        }
      </div>
    );
  }
}

const Title = styled.p`
  color: ${props => props.color};
  font-size: 3em;
`

const Image = styled.img`
  height: 100%;
  width: auto;
`

const mapStateToProps = (state, ownProps) => ({
  wordLists: _.values(state.entities.wordLists),
  user: _.first(_.values(state.entities.user))
});

export default connect(mapStateToProps)(WordListGameSelect);
