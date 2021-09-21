import React from 'react'
import Button from '../Button/Button'
import Import from '../Import/Import'

export default function Header() {
    return (
        <div className="header flex align-center">
            <div className="header__btn">
                <Import />
            </div>
        </div>
    )
}
