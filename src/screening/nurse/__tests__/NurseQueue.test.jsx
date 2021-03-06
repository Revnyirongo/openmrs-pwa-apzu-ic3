import React from 'react';
import { mount } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import {CardList, patientActions} from '@openmrs/react-components';
import NurseQueue from '../NurseQueue';

jest.mock('@openmrs/react-components', () => {
  return {
    patientObjByEncounterTypeFilter: jest.fn(),
    selectors: {
      getPatientStore: jest.fn((state) => ({
        1: {
          name: 'somePatient'
        }
      })),
      isPatientStoreUpdating: jest.fn(),
      isPatientStoreInErrorState: jest.fn()
    },
    patientActions: {
      clearSelectedPatient: jest.fn(),
      setSelectedPatient: jest.fn(),
    },
    CardList: () => (
      <div>
        <span>card list component</span>
      </div>
    ),
  }
});

let props, store;
let mountedComponent;

const mockStore = configureMockStore();

const nurseQueue = () => {
  if (!mountedComponent) {
    mountedComponent = mount(
      <Provider store={store}>
        <NurseQueue {...props} />
      </Provider>);
  }
  return mountedComponent;
};

describe('Component: NurseQueue', () => {
  beforeEach(() => {
    props = {
      session: {
        sessionLocation: {
          uuid: 'abc'
        }
      }
    };
    store = mockStore(
      {
        dispatch: {},
        openmrs: {
          session: {
            sessionLocation: {
              uuid: 'abc'
            }
          },
          patients: {
            set: {},
            selected: null
          }
        },
        router: {
          location: {
            pathname: '/'
          }
        }
      });
    mountedComponent = undefined;
  });

  it('renders properly', () => {
    //expect(toJson(nurseQueue())).toMatchSnapshot();
    expect(nurseQueue().find(CardList).length).toBe(1);
    expect(nurseQueue().find(CardList).props().rowSelectedActionCreators.length).toBe(3);
    let rowSelectedAction = {
      "pathname": '/screening',
      "state": {
        "queueLink": '/screening/nurse/queue'
      }
    };
    expect(nurseQueue().find(CardList).props().rowSelectedActionCreators[2]().payload.args[0]).toEqual(rowSelectedAction);
  });

});
