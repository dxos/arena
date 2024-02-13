import React from "react";

export const useCameraControls = () => {
  const ref = React.useRef<any>(null);

  const rotate = (rotation: any) => {
    if (ref.current) {
      const { setAzimuthalAngle, getAzimuthalAngle } = ref.current;
      setAzimuthalAngle(getAzimuthalAngle() + rotation);
    }
  };

  // On mount set the azimuthal angle to 45 degrees
  React.useEffect(() => {
    if (ref.current) {
      const { setAzimuthalAngle } = ref.current;
      setAzimuthalAngle(Math.PI / 4);
    }
  }, [ref]);

  return {
    ref,
    onLeft: () => rotate(-Math.PI / 2),
    onRight: () => rotate(Math.PI / 2),
  };
};
