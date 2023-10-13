import React, { useEffect, useState } from "react";

export const ScoreIncrement = ({ points }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 700);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div
      className={`score-increment ${
        isVisible ? "visible" : "hidden"
      } left-1/2 text-blue-500`}
    >
      +{points}pts
    </div>
  );
};
