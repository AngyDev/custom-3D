import React from "react";
import { useSelector } from "react-redux";
import screenshotIcon from "../../assets/images/icons/white/screenshot.svg";
import { getCamera, getRenderer, getScene } from "../../features/scene/sceneSlice";
import Button from "../Button/Button";

export default function Screenshot() {
  const renderer = useSelector(getRenderer);
  const scene = useSelector(getScene);
  const camera = useSelector(getCamera);

  const saveAsImage = () => {
    renderer.render(scene, camera);
    renderer.domElement.toBlob(
      function (blob) {
        var a = document.createElement("a");
        var url = URL.createObjectURL(blob);
        a.href = url;
        a.download = "screenshot.png";
        a.click();
      },
      "image/png",
      1.0,
    );
  };

  return <Button typeClass="btn--img btn__icon" img={screenshotIcon} onClick={saveAsImage} title="Screenshot" />;
}
