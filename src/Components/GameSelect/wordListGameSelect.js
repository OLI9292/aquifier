import React, { Component } from 'react';
import { Redirect } from 'react-router';
import styled from 'styled-components';
import _ from 'underscore';

import Button from '../Common/button';
import Link from '../Common/link';
import { color } from '../../Library/Styles/index';
import WordList from '../../Models/WordList';

import studyPng from '../../Library/Images/study-color.png';
import explorePng from '../../Library/Images/explore-color.png';

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

const timeLimits = [3, 5];

class WordListGameSelect extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: null,
      step: 0,
      timeLimit: timeLimits[0]
    };
  }

  async componentDidMount() {
    const result = await WordList.fetch();
    
    const wordLists = (result.data || [])
      .filter((w) => this.props.settings.game === 'explore' ? !w.isStudy : w.isStudy);
    const reformatted = this.reformatWordLists(wordLists);

    if (!_.isEmpty(reformatted)) {
      const selected = reformatted[_.keys(reformatted)[0]][0].id;
      this.setState({ wordLists: reformatted, selected: selected });
    }
  }

  // Temporary solution until better data modeling is agreed on - @akiva, @oliver
  reformatWordLists(wordLists) {
    return _.groupBy(_.sortBy(wordLists
      .map((w) => {
        const split = w.name.split(' ');
        const [category, name] = [split.slice(0, split.length - 1).join(' '), parseInt(split[split.length - 1], 10)];
        const valid = split.length > 1 && Number.isInteger(name);
        return valid ? { category: category, name: name, questions: w.questions, id: w._id } : null;
      })
      .filter((w) => w), 'name'), 'category')
  }

  handleClickedContinue() {
    if (this.state.step === 0) {
      this.setState({ step: 1 });
    } else {
      const gameLink = this.gameLink();
      if (gameLink) { this.setState({ redirect: gameLink }) } ;
    }
  }

  gameLink() {
    const timeLimit = this.state.timeLimit;
    const multiplayer = this.props.settings.multiplayer;
    const wordList = _.find(_.flatten(_.values(this.state.wordLists)), (w) => w.id === this.state.selected);
    if (wordList) {
      return multiplayer
        ? `/admin/wordList=${wordList.id}&time=${timeLimit}`
        : `/play/multiplayer=${multiplayer}&wordList=${wordList.id}&time=${timeLimit}`
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
    if (this.state.redirect && !window.location.href.endsWith(this.state.redirect)) {
      return <Redirect push to={this.state.redirect} />;
    }

    const p = params[this.props.settings.game];

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
                  {
                    this.state.wordLists[k].map((w) => {
                      const [fColor, bColor] = this.state.selected === w.id 
                        ? ['white', color.green]
                        : ['black', color.lightestGray];
                      return <Button.small key={w.name} color={bColor}
                        style={{color:fColor,margin:'0px 5px 0px 5px'}}
                        onClick={() => this.setState({ selected: w.id })}
                      >{w.name}</Button.small>
                    })
                  }
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
              timeLimits.map((t,i) => {
                const [fColor, bColor] = this.state.timeLimit === t ? ['white', color.green] : ['black', color.lightestGray];                
                return <Button.small key={i} color={bColor}
                  style={{color:fColor,margin:'0px 5px 0px 5px'}}
                  onClick={() => this.setState({ timeLimit: t })}
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
            <Button.medium color={color.blue} style={{marginTop:'25px'}} onClick={() => this.handleClickedContinue()}>
              {this.props.settings.multiplayer && this.state.step === 1 ? 'Generate Access Code' : 'Continue'}
            </Button.medium>
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

export default WordListGameSelect;
