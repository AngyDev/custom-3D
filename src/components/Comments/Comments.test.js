import React from "react";
import '@testing-library/jest-dom';
import { mount } from 'enzyme';
import Comments from "./Comments";

describe('Comments testing', () => {

    let wrapper;
    beforeEach(() => {
        const comments = [
            {
                "user_name": "Angela Busato",
                "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam"
            },
            {
                "user_name": "Angela Busato",
                "text": "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium"
            }
        ];

        wrapper = mount(<Comments data={comments}/>);
    });

    it('should contain title component', () => {
        expect(wrapper.find('h3').text()).toContain("Comments");
    });
});