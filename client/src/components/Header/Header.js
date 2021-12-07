import React, { useRef, useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { setHeaderHeight } from '../../features/dimensions/dimensionsSlice';
import AddComment from '../AddComment/AddComment'
import Button from '../Button/Button';
import Import from '../Import/Import';
import dashboardIcon from "../../assets/images/icons/th-large-solid.svg";
import { useHistory } from 'react-router';

export default function Header() {

    const headerRef = useRef(null);
    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        const headerCurrent = headerRef.current;

        dispatch(setHeaderHeight(headerCurrent.offsetHeight));
    }, []);

    const toDashboard = () => {
        history.push("/");
    }

    return (
        <div className="header flex align-center" ref={headerRef}>
            <div className="header__btn">
                <Button typeClass="btn--img" img={dashboardIcon} onClick={toDashboard}/>
            </div>
            <div className="header__btn">
                <Import />
            </div>
            <div className="header__btn">
                <AddComment />
            </div>
        </div>
    )
}
