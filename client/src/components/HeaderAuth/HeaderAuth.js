import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import Logo from "../../components/Logo/Logo";

export default function HeaderAuth() {
  const [theme, setTheme] = useState();

  useEffect(() => {
    setTheme(localStorage.getItem("theme"));
  }, []);

  return (
    <div className="text-center">
      <Logo className="h-36" theme={theme} />
    </div>
  );
}
