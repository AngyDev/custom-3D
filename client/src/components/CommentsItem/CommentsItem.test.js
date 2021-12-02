import React from "react";
import '@testing-library/jest-dom';
import { mount } from 'enzyme';
import CommentsItem from "./CommentsItem";

describe('CommentsItem testing', () => {

    let wrapper;
    beforeEach(() => {
        wrapper = mount(<CommentsItem name="Angela Busato" text="Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium" />);
    });

    it('should contain title component', () => {
        expect(wrapper.find('#name').text()).toContain("Angela Busato");
    });
});