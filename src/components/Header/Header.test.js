import React from "react";
import '@testing-library/jest-dom';
import { mount } from 'enzyme';
import Header from "./Header";

describe('Header testing', () => {

    let wrapper;
    beforeEach(() => {
        wrapper = mount(<Header />);
    });

    it('should contain Header text', () => {
        expect(wrapper.find('h1').text()).toContain("Header");
    });

    // it('should contain Profile component', () => {
    //     expect(wrapper.find('Profile')).toHaveLength(1);
    // });
});