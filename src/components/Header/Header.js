import React from 'react'
import AddComment from '../AddComment/AddComment'
import Import from '../Import/Import'

export default function Header() {
    return (
        <div className="header flex align-center">
            <div className="header__btn">
                <Import />
            </div>
            <div className="header__btn">
                <AddComment />
            </div>
        </div>
    )
}
