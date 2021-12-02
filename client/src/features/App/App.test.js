import React from "react";
import '@testing-library/jest-dom';
import { mount } from 'enzyme';
import App from "./App";

describe('App testing', () => {

    let wrapper;
    beforeEach(() => {
        wrapper = mount(<App />);
    });

    it('should contain Header component', () => {
        expect(wrapper.find('Header')).toHaveLength(1);
    });

    it('should contain Sidebar component', () => {
        expect(wrapper.find('Sidebar')).toHaveLength(1);
    });

    it('should contain Main component', () => {
        expect(wrapper.find('Main')).toHaveLength(1);
    });
});