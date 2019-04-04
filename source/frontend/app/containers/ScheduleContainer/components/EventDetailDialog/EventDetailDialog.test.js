import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';

configure({ adapter: new Adapter() });

import EventDetailDialog from './EventDetailDialog';

beforeEach(() => {});

it('renders without crashing', () => {
  let event = {
    name: 'test',
    eventRealizations: [
      {
        room: { name: 'testRoom' },
        lecturers: [
          {
            firstName: 'Julian',
            lastName: 'Visser',
            shortName: 'vissejul'
          }
        ]
      }
    ],
    startTime: '00:00',
    endTime: '01:00'
  };
  shallow(<EventDetailDialog event={event} />);
});
