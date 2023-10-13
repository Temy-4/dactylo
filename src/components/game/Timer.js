import { useEffect, useState } from "react";

export const Timer = ({ initialTime, additionalTime, gameOver }) => {
  const [time, setTime] = useState(initialTime);
  useEffect(() => {
    if (additionalTime) {
      setTime(time + additionalTime);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [additionalTime]);

  useEffect(() => {
    if (initialTime) {
      // setTime(initialTime);
      const interval = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime > 0) {
            return prevTime - 1;
          }
          return prevTime;
        });
      }, 1000); // Actualise le compteur toutes les 1000 ms (1 seconde)
      return () => clearInterval(interval); // Nettoie l'intervalle lorsque le composant est démonté
    }
  }, [initialTime]);

  useEffect(() => {
    if (time === 0) {
      gameOver();
    }
  }, [gameOver, time]);

  const strokeDasharray = `${((time / initialTime) * 283).toFixed(0)} 283`;
  return (
    <div className="flex justify-center items-center">
      <svg width="100" height="100" className="text-blue-600">
        <circle
          stroke="currentColor"
          strokeWidth="6"
          strokeDasharray={strokeDasharray}
          fill="none"
          r="45"
          cx="50"
          cy="50"
          style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
        ></circle>
      </svg>
      <span className="absolute text-3xl text-blue-900  font-semibold">
        {time}
      </span>
    </div>
  );
};
