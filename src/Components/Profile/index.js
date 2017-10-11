import React, { Component } from 'react';
import styled from 'styled-components';
import _ from 'underscore';

import Buttons from '../Buttons/default';
import { color } from '../../Library/Styles/index';

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: 'Melissa B.',
      words: [
        {
          value: 'CRYPTOZOOLOGIST',
          definition: 'someone who likes dope animals',
          experience: 5
        },
        {
          value: 'POLYCHROMATIC',
          definition: 'someone who likes dope animals',
          experience: 5
        },
        {
          value: 'NEOLITHIC',
          definition: 'someone who likes dope animals',
          experience: 5
        }
      ],
      stats: {
        wordsLearned: 48,
        wordsMastered: 7,
        wordsAccuracy: 73,
        ranking: 4,
        wordsPerMinute: 4.2        
      }
    }
  }

  render() {
    const wordProgress = () => {
      return this.state.words.map((w, i) => {
        const stars = _.range(1, 11).map((n, i2) => {
          return <StarImage key={i * 10 + i2} src={require(`../../Library/Images/star-${n <= w.experience ? 'yellow': 'grey'}.png`)} />;

        });
        return <Row key={i} backgroundColor={i % 2 === 0 ? color.lightestGray : 'white'}>
          <WordCell>
            <Word>{w.value}</Word>
            <div style={{display: 'inline-block'}}>
              {stars}
            </div>
          </WordCell>
          <DefinitionCell>{w.definition}</DefinitionCell>
        </Row>
      })
    }

    const stats = () => {
      return _.keys(this.state.stats).map((k) => {
        const statDescription = k.replace(/([A-Z])/g, ' $1').toLowerCase();
        return <StatContainer key={k}>
          <Stat>{this.state.stats[k]}</Stat>
          <StatDescription>{statDescription}</StatDescription>
        </StatContainer>
      })
    }

    return (
      <Layout>
        <ProgressSection>
          <Topline>
            <UserImage src={require('../../Library/Images/user.png')} />
            <Header>{this.state.name}'s Progress</Header>
          </Topline>
          <ProgressTable>
            {wordProgress()}
          </ProgressTable>
        </ProgressSection>
        <Sidebar>
          <ShareButton>Email Report</ShareButton>
          {stats()}
        </Sidebar>
      </Layout>
    );
  }
}

const Layout = styled.div`
`

const ProgressSection = styled.div`
  width: 70%;
  display: inline-block;
  vertical-align: top;
  margin-left: 2.5%;
`

// Header

const Topline = styled.div`
  height: 100px;
`

const UserImage = styled.img`
  float: left;
  height: 100%;
  width: auto;
  margin: 0px 25px 0px 25px;
`

const StarImage = styled.img`
  height: 20px;
  width: 20px;
`

const Header = styled.p`
  height: 75px;
  line-height: 75px;
  margin-left: 25px;
  font-size: 2.75em;
  vertical-align: top;
`

// Progress Table

const ProgressTable = styled.table`
  margin-top: 25px;
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
const Word = styled.p`
  display: block;
  height: 0%;
  line-height: 0%;
`

const DefinitionCell = styled.td`
  padding-left: 10px;
`

// Sidebar

const Sidebar = styled.div`
  width: 27.5%;
  text-align: center;
  display: inline-block;
`

const ShareButton = Buttons.medium.extend`
  background-color: ${color.blue};
  font-size: 1.35em;
  width: 140px;
  height: 50px;
  margin-top: 60px;
  margin-bottom: 25px;
`

// Stats Section

const StatContainer = styled.div`
  text-align: center;
  margin-top: -5px;
`

const Stat = styled.h1`
  font-size: 2.25em;
`

const StatDescription = styled.h4`
  color: ${color.gray};
  margin-top: -30px;
  font-size: 1em;
`

export default Profile;
