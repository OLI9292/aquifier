import { Redirect } from 'react-router';
import React, { Component } from 'react';
import _ from 'underscore';

import { shouldRedirect } from '../../../Library/helpers'
import get from 'lodash/get';
import { HIERARCHY } from './categories';

import LevelSelect from './levelSelect';

import {
  Container,
  ButtonsContainer,
  CategoryHeader,
  CategoryHeaderContainer,
  Circle,
  Triangle,
  SubcategoryContainer,
  SubcategoryButton,
  SubcategoryName,
  TopicIcon
} from './components';

class Explore extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.loadLevels(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.loadLevels(nextProps);
  }

  loadLevels(props) {
    if (_.isEmpty(props.levels) || this.state.categories) { return; }

    const subcategoriesGrouped = _.groupBy(props.levels, 'name');

    const categories = _.mapObject(HIERARCHY, (category, name) => {
      const exists = _.filter(category.subcategories, name => subcategoriesGrouped[name]);
      return _.map(exists, name => ({
        name: name, levels: subcategoriesGrouped[name], color: category.color
      }));
    });

    this.setState({ categories });
  }

  clickedBack() {
    this.setState({ selected: undefined });
  }

  render() {
    if (shouldRedirect(this.state, window.location)) { return <Redirect push to={this.state.redirect} />; }

    const {
      categories,
      selected
    } = this.state;

    const categoryHeader = (name, color) => {
      return <CategoryHeaderContainer>
        <Triangle />
          <CategoryHeader color={color}>
            {name.toUpperCase()}
          </CategoryHeader>
        <Circle />
      </CategoryHeaderContainer>
    }

    const button = subcategory => {
      return <SubcategoryContainer key={subcategory.name}>
        <SubcategoryButton onClick={() => this.setState({ selected: subcategory })} color={subcategory.color}>
          <TopicIcon src={require(`../../../Library/Images/Topics/${subcategory.name}.png`)} />
        </SubcategoryButton>
        <SubcategoryName>
          {subcategory.name}
        </SubcategoryName>
      </SubcategoryContainer>
    }

    const categorySelect = (() => {
      return categories && _.map(_.keys(categories), name => {
        const subcategories = categories[name];
        const color = get(subcategories[0], 'color');
        return <div key={name}>
          {categoryHeader(name, color)}
          <ButtonsContainer>
            {_.map(subcategories, subcategory => button(subcategory))}
          </ButtonsContainer>
        </div>
      })
    })();

    const levelSelect = (() => {
      return <LevelSelect
        subcategory={selected}
        clickedBack={this.clickedBack.bind(this)} />
    })();

    return (
      <Container>
        {selected ? levelSelect : categorySelect}
      </Container>
    );
  }
}

export default Explore
