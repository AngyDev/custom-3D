import React from "react";
import '@testing-library/jest-dom';
import { mount } from 'enzyme';
import CommentsListPanel from "./CommentsListPanel";

describe('CommentsListPanel testing', () => {

    let wrapper;
    beforeEach(() => {
        wrapper = mount(<CommentsListPanel />);
    });

    it('should contain title component', () => {
        expect(wrapper.find('h3').text()).toContain("Comments");
    });
});