import Spinner from "@/components/Spinner";
import { getAllScores, getPseudo } from "@/stores/game.store";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";

function Leaderboard() {
  const router = useRouter();
  const level = router.query.level;
  const [loading, setLoading] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const loadLeaderboard = async (level) => {
    if (level) {
      setLoading(true);
      const scoresArray = await getAllScores(level);
      const topUsers = scoresArray.sort((a, b) => b.score - a.score);

      // Fetch pseudos concurrently using Promise.all
      const usersWithPseudos = await Promise.all(
        topUsers.map(async (user) => {
          const pseudo = await getPseudo(user.uid);
          return { pseudo, score: user.score };
        })
      );
      console.log(usersWithPseudos, level);
      setLeaderboard(usersWithPseudos);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaderboard(level);
  }, [level]);

  return (
    <div>
      <div className="bg-white m-auto w-10/12 md:w-6/12 xl:w-3/12 p-5 shadow-md rounded-md my-10">
        <Link href="/" className="py-5 text-black block text-3xl text-center">
          Dactylo Leaderboard 👑
        </Link>
        <div className="mt-10">
          {loading ? (
            <div className="flex justify-center">
              <Spinner className={"fill-blue-800"} />
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {(leaderboard || []).map((usr, i) => {
                let index =
                  i < 3 ? (
                    <Image
                      width={40}
                      height={40}
                      src={"/assets/" + (i + 1) + ".png"}
                      alt=""
                    />
                  ) : (
                    <>{i + 1}.</>
                  );
                return (
                  <div
                    className=" items-center gap-4 flex justify-between"
                    key={`ìtem_score_${i}`}
                  >
                    <div className="flex-grow-0 w-6 text-right text-lg font-bold">
                      {index}
                    </div>
                    <div className=" py-3 border-slate-100 flex-grow text-left">
                      {usr.pseudo} — {usr.score} pts
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;
