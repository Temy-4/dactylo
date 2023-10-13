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

  return (
    <div className="text-7xl text-black/90 font-semibold  mt-10">{time}</div>
  );
};
