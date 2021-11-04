import React, { useRef, useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { setHeaderHeight } from '../../features/dimensions/dimensionsSlice';
import AddComment from '../AddComment/AddComment'
import Import from '../Import/Import'

export default function Header() {

    const headerRef = useRef(null);
    const dispatch = useDispatch();

    useEffect(() => {
        const headerCurrent = headerRef.current;

        dispatch(setHeaderHeight(headerCurrent.offsetHeight));
    }, [])

    return (
        <div className="header flex align-center" ref={headerRef}>
            <div className="header__btn">
                <Import />
            </div>
            <div className="header__btn">
                <AddComment />
            </div>
        </div>
    )
}
