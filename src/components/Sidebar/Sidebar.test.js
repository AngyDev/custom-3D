import React from "react";
import '@testing-library/jest-dom';
import { mount } from 'enzyme';
import Sidebar from "./Sidebar";
import { Provider } from "react-redux";
import configureStore from 'redux-mock-store';

describe('Sidebar testing', () => {

    let wrapper;
    beforeEach(() => {
        const initialState = {
            scene: {
                scene: {}
            }
        }
        const mockStore = configureStore();
        const store = mockStore(initialState);
        wrapper = mount(<Provider store={store}><Sidebar /></Provider>);
    });

    it('should contain Profile component', () => {
        expect(wrapper.find('Panel')).toHaveLength(1);
    });
});