import _ from 'underscore';
import queryString from 'query-string';
import { connect } from 'react-redux'
import { Redirect } from 'react-router';
import React, { Component } from 'react';
import get from 'lodash/get';

import { shouldRedirect } from '../../Library/helpers';
import { fetchLevelsAction, fetchRootsAction, fetchWordsAction } from '../../Actions/index';
import { STEPS } from './steps';
import { Container } from '../Common/container';

import {
  BackArrow,
  Circle,
  Header,
  OptionsContainer,
  OptionButton,
  Step,
  StepsContainer,
  StepDescription,
  NextButton
} from './components';

const MIN_COUNT_FOR_GRID = 10

class GameSetup extends Component {
  constructor(props) {
    super(props);

    const steps = _.map(STEPS, step => _.omit(step, 'selected'));

    this.state = {
      steps: steps,
      current: steps[0]
    };
  }

  componentDidMount() {
    const { levels, roots, words } = this.props;
    if (_.isEmpty(levels)) { this.props.dispatch(fetchLevelsAction()); } else { this.setLevels(levels); }
    if (_.isEmpty(roots))  { this.props.dispatch(fetchRootsAction()); }  else { this.setRoots(roots); }
    if (_.isEmpty(words))  { this.props.dispatch(fetchWordsAction()); }
  }

  componentWillReceiveProps(nextProps) {
    const gameType = this.state.steps[0].selected;
    if (nextProps.roots.length && !this.state.roots)   { this.setRoots(nextProps.roots, gameType); }
    if (nextProps.levels.length && !this.state.levels) { this.setLevels(nextProps.levels, gameType); }
  }

  setLevels(levels, gameType) {
    const sortBy = ['beginner', 'intermediate', 'advanced'];
    const generalVocabComparator = (a, b) => sortBy.indexOf(a.name) > sortBy.indexOf(b.name) ? 1 : -1;
    const topicComparator = (a, b) => a.slug.localeCompare(b.slug);
    this.setState({ levels: levels
      .sort((a, b) => a.type.localeCompare(b.type))
      .sort((a, b) => a.type === 'general' ? generalVocabComparator(a, b) : topicComparator(a, b))
      .map(level => _.extend({}, level, { title: level.slug.replace('-', ' ') }))
    }, () => gameType && this.clickedGameType(gameType));
  }

  setRoots(roots, gameType) {
    this.setState({ roots: roots
      .filter(r => r.words.length > 10)
      .sort((a, b) => a.value.localeCompare(b.value))
    }, () => gameType && this.clickedGameType(gameType));
  }

  clickedGameType(option) {
    const { levels, roots } = this.state
    if (roots && option === 'roots') {
      this.updateSteps(2, 'options', _.pluck(roots, 'value'));
    } else if (levels) {
      const type = option === 'topics' ? 'topic' : 'general';
      const filtered = _.filter(levels, level => level.type === type)
      this.updateSteps(2, 'options', _.pluck(filtered, 'title'));
    }
  }    

  clickedBack() {
    let { steps, current } = this.state;    
    if (this.isSelectingRoots()) { steps[1]['selected'] = undefined };
    steps = this.updateSteps(current.index - 1, 'selected');
    this.setState({ steps: steps, current: steps[current.index - 2] });
  }

  updateSteps(index, attr, data) {
    return _.map(this.state.steps, step => {
      if (step.index === index) { step[attr] = data };
      return step;
    });
  }

  isSelectingRoots(index) {
    return (index || this.state.current.index) === 2 && this.state.steps[0].selected === 'roots';
  }

  clicked(option) {
    const currentIdx = this.state.current.index;

    // Set step 2 options to match selected gametype
    if (currentIdx === 1) { this.clickedGameType(option); }

    // Set selected option or create / preview match
    if (_.contains([1,2,3], currentIdx)) {
      if (this.isSelectingRoots()) {
        const alreadySelected = this.state.steps[1].selected || [];
        const selected = _.contains(alreadySelected, option)
          ? _.without(alreadySelected, option)
          : alreadySelected.concat(option);
        const steps = this.updateSteps(currentIdx, 'selected', selected);
        this.setState({ steps });
      } else {
        const steps = this.updateSteps(currentIdx, 'selected', option);
        this.setState({ steps: steps, current: steps[currentIdx] });              
      }
    } else {
      option.includes('create') ? this.createMatch() : this.previewMatch();
    }
  }

  createMatch() {
    const { levels, roots } = this.state;
    const [type, data, timeStr] = _.pluck(this.state.steps, 'selected');
    
    let settings = {};
    let words

    settings['time'] = parseInt(timeStr.charAt(0), 10);
    settings['type'] = type;

    if (type === 'roots') {
      settings['name'] = 'root-review';
      const ids = _.pluck(_.filter(roots, r => _.contains(data, r.value)), '_id');
      words = _.pluck(_.filter(this.props.words, w => _.intersection(w.roots, ids).length), 'value');
    } else {
      const level = _.find(levels, l => l.title === data);
      settings['name'] = get(level, 'slug');
      words = level.words;
    }
    settings['words'] = _.shuffle(words).join(',');

    this.setState({ redirect: '/admin/?' + queryString.stringify(settings) });
  }

  previewMatch() {
    // TODO: - implement 
    // const { levels, steps } = this.state;
    // const level = _.find(levels, level => level.title === steps[1].selected)
  }

  render() {
    if (shouldRedirect(this.state, window.location)) { return <Redirect push to={this.state.redirect} />; }

    const {
      steps,
      current
    } = this.state

    const step = data => {
      return <Step key={data.index}>
        <Circle selected={data.index === current.index}>
          {data.index}
        </Circle>
        <StepDescription>
          {this.isSelectingRoots(data.index) ? `${(steps[1].selected || []).length} roots` : data.selected}
        </StepDescription>
      </Step>
    }

    return (
      <Container>
        <BackArrow
          hide={current.index === 1}
          onClick={() => this.clickedBack()}
          src={require('../../Library/Images/icon-back-arrow.png')} />
        <StepsContainer>
          {_.map(steps, step)}
        </StepsContainer>
        <Header>
          {this.isSelectingRoots() ? 'choose roots' : current.header}
        </Header>
        <OptionsContainer grid={current.options.length > MIN_COUNT_FOR_GRID}>
          {
            _.map(current.options, o => <OptionButton
              small={current.options.length > MIN_COUNT_FOR_GRID}
              key={o}
              selected={this.isSelectingRoots() && _.contains(current.selected, o)}
              onClick={() => this.clicked(o)}>
              {o}</OptionButton>)
          }
        </OptionsContainer>
        <NextButton
          onClick={() => this.setState({ current: steps[2] })}
          hide={!this.isSelectingRoots()}>
          NEXT
        </NextButton>
      </Container>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  session: state.entities.session,
  user: _.first(_.values(state.entities.user)),
  levels: _.values(state.entities.levels),
  words: _.values(state.entities.words),
  roots: _.values(state.entities.roots)
});

export default connect(mapStateToProps)(GameSetup);
