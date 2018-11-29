import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';

configure({ adapter: new Adapter() });

import MensaContextMenu from './MensaContextMenu';

jest.mock('../../../../stores/MensaStore');
jest.mock('../../../../actions/MensaActions');

it('renders without crashing', () => {
  shallow(<MensaContextMenu />);
});
