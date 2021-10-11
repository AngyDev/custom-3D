import React from "react";
import '@testing-library/jest-dom';
import { mount } from 'enzyme';
import AddComment from "./AddComment";

describe('AddComment testing', () => {

    let wrapper;
    beforeEach(() => {
        wrapper = mount(<AddComment />);
    });

    it('should contain Button component', () => {
        expect(wrapper.find('Button')).toHaveLength(1);
    });
});