import React from 'react';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import sinon from 'sinon';

import Dropdown from '../../Components/Common/dropdown';

const choices = ['Earth', 'TAG'];

describe('Dropdown', () => {
  it('should render correctly', () => {
    const output = shallow(
      <Dropdown
        choices={choices}
        selected={choices[0]} />
    );
    expect(shallowToJson(output)).toMatchSnapshot();
  });
})
