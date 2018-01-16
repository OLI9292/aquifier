import { connect } from 'react-redux'
import React, { Component } from 'react';
import styled from 'styled-components';
import _ from 'underscore';

import Firebase from '../../Networking/Firebase';
import { color } from '../../Library/Styles/index';

class Collaborative extends Component {
  constructor(props) {
    super(props);
    this.state = {
      words: [],
      answered: []
    }
  }

  async componentDidMount() {
    if (this.props.words.length) {
      this.createMatch(this.props.words);
    }    
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.words.length) {
      this.createMatch(nextProps.words);
    }
  }  

  createMatch = async (words) => {
    Firebase.refs.games.once('value', (snapshot) => {
      const usedCodes = _.keys(snapshot.val());
      const accessCode = this.generateAccessCode(usedCodes);

      const game = {};
      const answers = _.pluck(_.sample(words, 20), 'value');

      game[accessCode] = {
        status: 1,
        type: 'collaborative',
        answers: answers.join(','),
        answered: ''
      };

      Firebase.refs.games.update(game, (error) => {
        if (error) {
          this.setState({ errorMessage: 'Failed to create match.' });
        } else {
          this.setState({ accessCode: accessCode, words: answers }, this.pollFirebase);
        }
      });
    });
  }

  generateAccessCode(exclude) {
    return _.sample(_.range(1000, 10000).filter((n) => !_.contains(exclude, n)));
  }  

  pollFirebase() {
    Firebase.refs.games.child(this.state.accessCode).on('value', (snap) => {
      const answered = _.mapObject(snap.val().players, (v, k) => v === 0 ? [] : v.split(','));
      this.setState({ answered });
    });    
  }

  render() {
    const amountRemaining = () => {
      const amountAnswered = _.filter(this.state.words, w => _.contains(_.flatten(_.values(this.state.answered)), w)).length;
      return <p style={{position:'absolute',right:'35px',fontSize:'2em',top:'0px'}}>
        {`${amountAnswered}/${this.state.words.length}`}
      </p>
    }

    return (
      <div>
        <h3 style={{fontSize:'2.75em',paddingTop:'50px',textAlign:'center'}}>
          {this.state.accessCode}
        </h3>

        {amountRemaining()}

        <WordsContainer>
          {this.state.words.sort().map((w) => {
            const answeredBy = _.find(_.keys(this.state.answered), k => _.contains(this.state.answered[k], w));
            return <Word key={w} solved={answeredBy !== undefined}>
              {answeredBy && <Answerer>
                {answeredBy.split(' ').map(s => s.charAt(0)).join('')}
              </Answerer>}
              {w.toUpperCase()}
            </Word>;
          })}
        </WordsContainer>
      </div>
    );
  }
}

const WordsContainer = styled.div`
  width: 90%;
  margin: 0 auto;
  display: grid;
  grid-gap: 50px;
  grid-template-columns: auto auto auto auto;  
  margin-bottom: 50px;
`

const Word = styled.div`
  text-align: center;
  color: ${props => props.solved ? color.green : color.red};
`

const Answerer = styled.span`
  position: absolute;
  margin-top: -15px;
  margin-left: -10px;
  text-align: right;
  color: black;
  font-size: 0.8em;
`

const mapStateToProps = (state, ownProps) => ({
  words: _.values(state.entities.words)
});

export default connect(mapStateToProps)(Collaborative);
