import { connect } from 'react-redux'
import React, { Component } from 'react';
import styled from 'styled-components';
import _ from 'underscore';

import { color } from '../../Library/Styles/index';
import { capitalizeOne, sum } from '../../Library/helpers'
import { loadUser } from '../../Actions/index';

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      wordExperience: [],
      stats: {
        wordsLearned: {
          name: 'words learned',
          image: 'book',
          color: color.blue
        },
        wordsMastered: {
          name: 'words mastered',
          image: 'wizard',
          color: color.yellow
        },
        wordAccuracy: {
          name: 'word accuracy',
          image: 'archer',
          color: color.red
        },
      },
      wordsLearned: 0,
      wordsMastered: 0,
      wordAccuracy: 0
    }
  }

  async componentDidMount() {
    const id = _.last(window.location.href.split('/'));
    const result = await this.props.dispatch(loadUser(id, this.props.session, false));

    if (!result.error) {
      const user = _.first(_.values(result.response.entities.user));

      this.setState({
        name: capitalizeOne(user.firstName),
        wordExperience: _.sortBy(user.words, 'name'),
        wordsLearned: user.words.length,
        wordsMastered: user.words.filter((w) => w.experience >= 7).length,
        wordAccuracy: `${parseInt(100 * sum(user.words, 'correct')/sum(user.words, 'seen'), 10) || 0}%`
      });
    }
  }

  render() {
    const wordExperience = this.state.wordExperience.map((obj) => {
      const idx = _.findIndex(this.props.words, (w) => w.value === obj.name);
      if (idx >= 0) { obj.definition = _.pluck(this.props.words[idx].definition, 'value').join('') };
      return obj;      
    })

    const wordProgress = () => {
      return wordExperience.map((w, i) => {
        const stars = _.range(1, 11).map((n, i2) => {
          return <StarImage 
            key={i * 10 + i2}
            src={require(`../../Library/Images/star-${n <= w.experience ? 'yellow': 'grey'}.png`)} />;
        })

        return <Row key={i} backgroundColor={i % 2 === 0 ? color.lightestGray : 'white'}>
          <WordCell>
            <WordValue>{w.name}</WordValue>
            <div style={{display: 'inline-block'}}>
              {stars}
            </div>
          </WordCell>
          <DefinitionCell>
            {w.definition}
          </DefinitionCell>
        </Row>
      })
    }

    const stats = () => {
      return _.keys(this.state.stats).map((k) => {
        return <StatContainer key={k}>
          <div>
            <StatImage src={require(`../../Library/Images/${this.state.stats[k].image}.png`)} />
            <Stat color={this.state.stats[k].color}>
              {this.state[k]}
            </Stat>
          </div>
          <StatDescription>
            {this.state.stats[k].name}
          </StatDescription>
        </StatContainer>
      })
    }

    return (
      <div>
        <ProgressSection>
          <Header>
            {this.state.name}'s Progress
          </Header>
          <ProgressTable>
            {wordProgress()}
          </ProgressTable>
        </ProgressSection>
        <Sidebar>
          {stats()}
        </Sidebar>
      </div>
    );
  }
}

const ProgressSection = styled.div`
  width: 70%;
  display: inline-block;
  vertical-align: top;
  margin-left: 2.5%;
`

// Header

const Header = styled.p`
  height: 75px;
  line-height: 75px;
  margin-left: 25px;
  font-size: 2.75em;
  vertical-align: top;
  text-align: center;
`

// Table

const ProgressTable = styled.table`
  margin: 25px 0px 25px 0px;
  width: 100%;
  border-collapse: collapse;
`

const Row = styled.tr`
  background-color: ${props => props.backgroundColor};
  height: 75px;
`

const WordCell = styled.td`
  width: 50%;
  text-align: center;
`

const WordValue = styled.p`
  display: block;
  height: 0%;
  line-height: 0%;
`
const StarImage = styled.img`
  height: 20px;
  width: 20px;
`

const DefinitionCell = styled.td`
  padding-left: 10px;
`

// Sidebar

const Sidebar = styled.div`
  width: 27.5%;
  text-align: center;
  display: inline-block;
  margin-top: 25px;
`

// Stats Section

const StatContainer = styled.div`
  text-align: center;
  margin-top: -5px;
`

const StatImage = styled.img`
  height: 45px;
  width: 45px;
  display: inline-block;
  vertical-align: middle;
  margin-right: 5px;
`

const Stat = styled.h1`
  font-size: 2.25em;
  color: ${props => props.color};
  display: inline-block;
  vertical-align: middle;
  margin-left: 5px;
`

const StatDescription = styled.h4`
  color: ${color.gray};
  margin-top: -20px;
  font-size: 1em;
`

const mapStateToProps = (state, ownProps) => ({
  session: state.entities.session,
  words: _.values(state.entities.words),
})

export default connect(mapStateToProps)(Profile)
