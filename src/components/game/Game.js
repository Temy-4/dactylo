import { useCallback, useEffect, useRef, useState } from "react";
import { Timer } from "./Timer";
import {
  getRank,
  getTopUsernamesAndScores,
  getWords,
  saveScore,
  useGameDispatch,
  useGameState,
} from "@/stores/game.store";
import { ordinalSuffixOf, shuffleArray } from "@/utils/helper";
import Modal from "../Modal/Modal";
import { ScoreIncrement } from "./ScoreIncrementAnimation";
import { useAuth } from "@/stores/auth.store";
import Link from "next/link";
import Image from "next/image";

const DEFAULT_TIME = 60;

export const Game = ({ user = {} }) => {
  const inputTextRef = useRef();
  const dispatch = useGameDispatch();
  const { signOut } = useAuth();
  const { levels, leaderboard, loading, rank } = useGameState();
  const [words, setWords] = useState();
  const [index, setIndex] = useState(0);
  const [textToWrite, setTextToWrite] = useState();
  const [initTime, setInitTime] = useState(0);
  const [points, setPoints] = useState(0);
  const [additionalTime, setAdditionalTime] = useState(0);
  const [gameIsOver, setGameIsOver] = useState(true);
  const [newPoints, setNewPoints] = useState(0);
  const start = useCallback(() => {
    if (levels) {
      setGameIsOver(false);
      setInitTime(DEFAULT_TIME);
      setPoints(0);
      setNewPoints(0);
      setIndex(0);
      setWords(shuffleArray(levels[user.level][user?.lang || "fr"].words));
      inputTextRef.current.value = "";
      inputTextRef.current.disabled = undefined;
      inputTextRef.current.focus();
    }
  }, [levels, user?.lang, user.level]);

  const checkWord = useCallback(
    (e) => {
      const typed = e.target.value;
      // console.log({ typed, textToWrite });
      if (typed.length > textToWrite.length) {
      } else if (typed === textToWrite) {
        setNewPoints(textToWrite.length);
        setPoints(points + textToWrite.length);
        setIndex(index + 1);
        // setAdditionalTime(Math.round(textToWrite.length / 3)); // TODO sera mieux géré plus tard.
        inputTextRef.current.value = "";
      } else {
      }
    },
    [textToWrite, index, points]
  );

  const gameOver = useCallback(() => {
    setGameIsOver(true);
    inputTextRef.current.disabled = "disabled";
    console.log({ user });
    saveScore(dispatch, {
      score: points,
      lang: user.lang || "fr",
      ...user,
    });
  }, [points, dispatch, user]);

  const handleFocus = useCallback(() => {
    if (inputTextRef.current) inputTextRef.current.focus();
  }, [inputTextRef]);

  useEffect(() => {
    if (user && user.pseudo) {
      getRank(dispatch, user);
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (user && user.level) getTopUsernamesAndScores(dispatch, user.level);
  }, [user, dispatch]);

  useEffect(() => {
    if (user && user.level) {
      if (!levels) {
        getWords(dispatch);
      } else if (!words) {
        setWords(shuffleArray(levels[user.level][user?.lang || "fr"].words));
      }
    } else {
      inputTextRef.current.disabled = "disabled";
    }
  }, [
    user,
    inputTextRef,
    dispatch,
    user.lang,
    user.level,
    levels,
    words,
    gameIsOver,
    start,
  ]);

  useEffect(() => {
    if (words) {
      setTextToWrite(words[index]);
    }
  }, [words, textToWrite, index]);

  return (
    <div
      className=" h-screen w-screen  jakarta flex-col flex"
      style={{
        backgroundSize: "cover",
        backgroundImage: "url('/bg.png')",
      }}
    >
      <Modal dismissible={false} show={user && user.pseudo && gameIsOver}>
        <div className="w-12/12 sm:w-8/12 md:w-6/12 lg:w-4/12 xl:w-4/12 bg-white rounded-lg shadow-lg p-5">
          <h2 className="text-center mb-10 text-2xl">Ready to play ? </h2>
          <p className="text-center">
            Type as many words as you can within{" "}
            <strong>{DEFAULT_TIME} seconds</strong>. Each word you write will
            appear immediately after you finish typing it.
          </p>
          <div className="px-0 mt-4 ">
            <button
              onClick={() => (words ? start() : undefined)}
              className="p-2 mt-4 rounded-md w-full  bg-blue-500 hover:bg-blue-600 text-white"
            >
              Start
            </button>
            <div className="flex gap-4">
              <Link
                href={"/leaderboard/" + (user?.level || 1)}
                target="_blank"
                className="p-2 text-center mt-4 rounded-md w-full  bg-teal-500 hover:bg-teal-600 text-white"
              >
                Leaderboard
              </Link>

              <button
                onClick={signOut}
                className="p-2 mt-4 rounded-md w-full  bg-red-500 hover:bg-red-600 text-white"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </Modal>
      <div className="head overflow-hidden box-border w-screen h-2/12 flex justify-between items-center px-10 py-5">
        <div className="title suranna text-white text-7xl">
          Dactylo <small className="text-5xl">⌨️</small>
        </div>
        <div className="bg-white  py-3 flex flex-col gap-1 w-1/5 justify-center rounded-lg ">
          <div className="name text-center text-2xl">
            {user?.pseudo || user?.displayedName}
          </div>
          <div className="score text-blue-600 text-center">
            {rank && (
              <span
                dangerouslySetInnerHTML={{ __html: ordinalSuffixOf(rank) }}
              />
            )}{" "}
            — Level {user?.level}
          </div>
        </div>
      </div>
      <div className="body overflow-hidden flex-grow box-border gap-8 h-9/12 justify-between w-screen flex  px-10 py-5 ">
        <div
          className="main bg-white p-10 flex-grow rounded-lg flex flex-col justify-between text-3xl "
          onClick={handleFocus}
          style={{
            background:
              "linear-gradient(120deg, rgba(255, 255, 255, 0.94) 8.7%, rgba(255, 255, 255, 0.63) 39.74%, rgba(255, 255, 255, 0.75) 78.38%, rgba(255, 255, 255, 0.67) 98.59%)",
            strokeWidth: "3px",
            stroke: "#FBFBFB",
            filter: "drop-shadow(0px 4px 24px rgba(51, 133, 254, 0.20))",
            backdropFilter: "blur(11px)",
          }}
        >
          <div className="flex justify-start flex-grow-1">
            <div className="w-1/3">
              Score : <strong>{points}pts</strong>
            </div>
            <div className="w-1/3 flex flex-col justify-center items-center ">
              <span>Remaining Time </span>
              {!!initTime && !gameIsOver ? (
                <Timer
                  initialTime={initTime}
                  additionalTime={additionalTime}
                  gameOver={gameOver}
                />
              ) : (
                <>-</>
              )}
            </div>
          </div>
          <div className="text-center mb-10">
            <div className="">Word to type</div>
            <div className="text-9xl">{textToWrite || "-"}</div>
          </div>
          <div className="text-center mb-10 relative">
            {!!newPoints && (
              <ScoreIncrement key={textToWrite} points={newPoints} />
            )}
            <input
              onKeyUp={checkWord}
              type="text"
              placeholder={gameIsOver ? "Game over" : "Type here"}
              className="text-center rounded-2xl text-7xl border-2 p-6 border-blue-500 disabled:border-gray-500 disabled:bg-slate-200"
              autoFocus
              ref={inputTextRef}
            />
          </div>
        </div>
        <div className="leaderboard  px-4 py-3  w-1/5 rounded-lg bg-white xl:block hidden">
          <h4 className="text-3xl py-4 text-center">LEADERBOARD</h4>
          <hr className="bg-slate-100" />
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
                  <div className="border-b py-3 border-slate-100 flex-grow text-left">
                    {usr.pseudo} — {usr.score} pts
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="footer overflow-hidden text-white box-border py-5 h-1/12 w-screen text-center ">
        Copyright © Dactylo, 2023.
      </div>
    </div>
  );
};
