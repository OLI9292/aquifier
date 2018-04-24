import React, { Component } from 'react';
import { Redirect } from 'react-router';
import _ from 'underscore';
import get from 'lodash/get';

import { color } from '../../Library/Styles/index';
import { shouldRedirect, sum } from '../../Library/helpers';
import Header from '../Common/header';

import greenArrow from '../../Library/Images/slim-arrow-green.png';
import grayArrow from '../../Library/Images/slim-arrow-gray.png';
import grayDropdownArrow from '../../Library/Images/dropdown-arrow-gray.png';
import greenDropdownArrow from '../../Library/Images/dropdown-arrow-green.png';

import {
  Arrow,
  Dropdown,
  DropdownItem,
  FlexContainer,
  Row,
  Table,
  TableCell
} from './components'

class StudentsTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sortBy: {
        attr: 'name',
        ascending: false
      },
      filterBy: []
    };
  }

  sortStudents(attr, hover = false) {
    const ascending = this.state.sortBy.attr === attr && !this.state.sortBy.ascending;
    const key = hover ? "sortByHover" : "sortBy";
    const state = {};
    state[key] = { attr: attr, ascending: ascending };
    this.setState(state);
  }

  handleStudentClick(student) {
    const redirect = '/profile/' + student.id;
    this.setState({ redirect });
  }

  render() {
    const {
      redirect,
      sortBy,
      hoveringOverRow,
      sortByHover,
      dropdownItemHover,
      dropdownHover,
      dropdown,
      filterBy
    } = this.state;

    let {
      students,
      showDistrictAdminView
    } = this.props;

    if (shouldRedirect(this.state, window.location)) { return <Redirect push to={redirect} />; }

    students = _.map(students, data => ({
      id: data._id,
      name: data.firstName + ' ' + data.lastName.charAt(0),
      school: data.school || "Middle School",
      grade: data.grade || "4th",
      wordsLearned: data.totalWordsLearned,
      timePlayed: data.totalTimeSpent
    }));

    let [grades, schools] = _.map(["grade", "school"], attr => _.uniq(_.pluck(students, attr)));    
    if (_.pluck(filterBy, "key").includes("grade")) { grades = grades.concat("All Grades"); }
    if (_.pluck(filterBy, "key").includes("school")) { schools = schools.concat("All Schools"); }

    _.forEach(filterBy, filter => { students = _.filter(students, s => s[filter.key] === filter.value); })
    students = _.sortBy(students, sortBy.attr);
    if (sortBy.ascending) { students.reverse(); }

    const average = attr => parseInt(sum(students, attr)/students.length, 10);

    const row = (student, index) => <Row 
      dark={index % 2 !== 0}
      key={index}
      onMouseOver={() => this.setState({ hoveringOverRow: index })}
      onMouseLeave={() => this.setState({ hoveringOverRow: null })}
      hover={hoveringOverRow === index}
      onClick={() => this.handleStudentClick(student)}>
      <TableCell>{student.name}</TableCell>
      {showDistrictAdminView && <TableCell>{student.grade}</TableCell>}
      {showDistrictAdminView && <TableCell>{student.school}</TableCell>}
      <TableCell>{student.wordsLearned}</TableCell>
      <TableCell>{`${student.timePlayed}m`}</TableCell>
   </Row>;

    const arrowFor = attr => {
      const [hoverArrow, sortByArrow] = [get(sortByHover, "attr") === attr, sortBy.attr === attr]
      if (hoverArrow) { return <Arrow src={greenArrow} ascending={sortByHover.ascending} />; }
      if (sortByArrow) { return <Arrow src={grayArrow} ascending={sortBy.ascending} />; }
      return <Arrow hide src={grayArrow} />;
    }

    const dropdownItem = (value, key) => <DropdownItem
      key={value}
      hover={dropdownItemHover === value}
      onMouseOver={() => this.setState({ dropdownItemHover: value })}
      onMouseLeave={() => this.setState({ dropdownItemHover: null })}
      onClick={() => {
        let update = _.reject(filterBy, filter => filter.key === key);
        if (!value.includes("All ")) { update = update.concat({ key: key, value: value }); }
        this.setState({ filterBy: update, dropdown: null });
      }}>
      {value}
    </DropdownItem>

    const sortHeader = (attr, title) => <TableCell header
      onMouseOver={() => this.sortStudents(attr, true)}
      onMouseLeave={() => this.setState({ sortByHover: null })}
      onClick={() => this.sortStudents(attr)}>
      <FlexContainer>
        <Header.small style={{color:color.gray2}}>
          {title}
        </Header.small>
        {arrowFor(attr)}
      </FlexContainer>
    </TableCell>;

    const dropdownHeader = attr => <TableCell
      green={dropdown === attr}
      header>
      <FlexContainer
        onMouseOver={() => this.setState({ dropdownHover: attr })}
        onMouseLeave={() => this.setState({ dropdownHover: null })}
        onClick={() => this.setState({ dropdown: dropdown === attr ? null : attr })}>
        <Header.small style={{color:dropdown === attr ? color.extraDarkLimeGreen : color.gray2}}>
          {_.pluck(filterBy, "key").includes(attr) ? attr : `all ${attr}s`}
        </Header.small>
        <Arrow
          small
          ascending={dropdown !== attr} 
          src={[dropdown, dropdownHover].includes(attr) ? greenDropdownArrow : grayDropdownArrow} />
      </FlexContainer>
      {dropdown === attr && <Dropdown>
        {_.map((attr === "grade" ? grades : schools), data => dropdownItem(data, attr))}
      </Dropdown>}              
    </TableCell>

    return (
      <Table>
        <tbody>
          <Row dark>
            {sortHeader("name", "name")}
            {showDistrictAdminView && dropdownHeader("grade")}
            {showDistrictAdminView && dropdownHeader("school")}
            {sortHeader("wordsLearned", "words learned")}
            {sortHeader("timePlayed", "time played")}
          </Row>
          
          {_.map(students, row)}

          <Row holistic>
            <TableCell holistic>Average</TableCell>
            {showDistrictAdminView && <TableCell header />}
            {showDistrictAdminView && <TableCell header />}            
            <TableCell holistic>{average('wordsLearned')}</TableCell>
            <TableCell holistic>{`${average('timePlayed')}m`}</TableCell>
          </Row>          
        </tbody>
      </Table>
    );
  }
}

export default StudentsTable;
