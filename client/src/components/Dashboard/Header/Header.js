import React, { useState } from "react";
import Button from "../../Button/Button";
import Logo from "../../Logo/Logo";
import plus from "../../../assets/images/icons/plus.svg";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState(false);

  const openModal = () => {
    setActive(!active);
    setIsOpen(true);
  };

  const closeModal = () => {
    setActive(!active);
    setIsOpen(false);
  };

  return (
    <div className="container-component flex w-full h-18 bg-base text-white p-3">
      <div className="flex gap-5">
        <Logo />
        <Button text="Nuovo" img={plus} onClick={openModal} title="Nuovo" active={active} />
      </div>
      {isOpen && <div></div>}
    </div>
  );
}
