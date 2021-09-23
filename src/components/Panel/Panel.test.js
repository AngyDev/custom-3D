import React from "react";
import '@testing-library/jest-dom';
import { mount } from 'enzyme';
import Panel from "./Panel";

describe('Panel testing', () => {

    let wrapper;
    beforeEach(() => {
        wrapper = mount(<Panel />);
    });

    it('should contain Panel text', () => {
        expect(wrapper.find('h1').text()).toContain("Panel");
    });
});