import React from 'react';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import sinon from 'sinon';

import Button from '../../Components/Common/button';

const sizes = ['small', 'medium', 'large'];

describe('Button', () => {
  const testButton = size => {
    it(`should render a ${size} button correctly`, () => {
      const Button_ = Button[size];
      const output = shallow(<Button_ />);
      expect(shallowToJson(output)).toMatchSnapshot();
    });    
  }  

  testButton('small')
  testButton('medium')
  testButton('large')
})