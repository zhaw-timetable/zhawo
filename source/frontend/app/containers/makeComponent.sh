#!/bin/bash

echo Enter Component Name:

read name

mkdir $name

cd $name

cat > $name.js <<EOF
// @flow

import React, { Component } from 'react';
import './$name.sass';
import * as Actions from '../../actions/Actions.js';
import Store from '../../stores/Store.js';

type Props = {};
type State = {};

class $name extends Component<Props, State> {
  state = {};

  // Bind change listener
  componentWillMount() {}

  // Unbind change listener
  componentWillUnmount() {}

  render() {
    return (
      <div className="$name">
        <h1>$name</h1>
      </div>
    );
  }
}

export default $name;
EOF


cat > $name.test.js <<EOF

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';

configure({ adapter: new Adapter() });

import $name from './$name';

it('renders without crashing', () => {
  shallow(<$name />);
});

it('should render one root element with className $name', () => {
  const wrapper = shallow(<$name />);
  expect(wrapper.find('.$name')).toHaveLength(1);
});
EOF

cat > $name.sass <<EOF
@import '../../sass/vars'

.$name
EOF


echo Component $name Created
