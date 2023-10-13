import { firebaseApp } from "@/utils/firebase";
import { log } from "@/utils/helper";
import axios from "axios";
import React from "react";

// Add this function to get the user's ID token
export const getIdToken = async () => {
  const user = firebaseApp.auth().currentUser;
  if (!user) return null;
  return await user.getIdToken();
};

export async function getWords(dispatch) {
  dispatch({ type: "loading", payload: true });
  try {
    const response = await axios.get(`/api/levels`);
    dispatch({ type: "levels", payload: response.data });
    dispatch({ type: "loading", payload: false });
  } catch (error) {
    dispatch({ type: "error", payload: error });
  }
  dispatch({ type: "loading", payload: false });
}

export async function getUser(dispatch, uid) {
  dispatch({ type: "loading", payload: true });
  try {
    const usersRef = firebaseApp.firestore().collection("users").doc(uid);
    const user = await usersRef.get();
    dispatch({ type: "user", payload: user.data() });
    dispatch({ type: "loading", payload: false });
  } catch (error) {
    dispatch({ type: "error", payload: error });
  }
  dispatch({ type: "loading", payload: false });
}

export async function getRank(dispatch, userData) {
  const scoresRef = firebaseApp
    .firestore()
    .collection("scores/levels/" + userData.level)
    .doc("list");

  // Fetching all scores
  const scoresDoc = await scoresRef.get();

  // Check if document exists
  if (!scoresDoc.exists) {
    console.error("No scores found");
    return;
  }

  // Extracting scores and converting them into an array
  const scoresMap = scoresDoc.data();
  const scoresArray = Object.entries(scoresMap).map(([uid, score]) => ({
    uid,
    score,
  }));

  // Sorting the scores
  scoresArray.sort((a, b) => b.score - a.score);

  // Finding the rank
  const rank =
    scoresArray.findIndex((scoreObj) => scoreObj.uid === userData.uid) + 1;
  dispatch({ type: "rank", payload: rank });
}

export async function updateProfile(dispatch, userData) {
  dispatch({ type: "loading", payload: true });
  try {
    const usersRef = firebaseApp
      .firestore()
      .collection("users")
      .doc(userData.uid);
    await usersRef.set(userData);
    const user = await usersRef.get();

    const scoresRef = firebaseApp
      .firestore()
      .collection("scores/levels/" + userData.level)
      .doc("list");

    await scoresRef.update({
      [userData.uid]: 0,
    });

    // const response = await axios.post(`/api/user`, user);
    dispatch({ type: "user", payload: user.data() });
    dispatch({ type: "loading", payload: false });
  } catch (error) {
    console.error(error);
    dispatch({ type: "error", payload: error });
  }
  dispatch({ type: "loading", payload: false });
}

export async function getAllScores(level) {
  try {
    const scoresRef = firebaseApp
      .firestore()
      .collection("scores/levels/" + level)
      .doc("list");

    const doc = await scoresRef.get();

    if (!doc.exists) {
      console.error("No such document!");
      return [];
    }

    const scoresMap = doc.data();
    const scoresArray = Object.entries(scoresMap).map(([uid, score]) => ({
      uid,
      score,
    }));

    return scoresArray;
  } catch (error) {
    console.error("Error getting document:", error);
  }
}

export async function getPseudo(uid) {
  try {
    const userRef = firebaseApp.firestore().collection("users").doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      console.error("No user found for uid:", uid);
      return null;
    }

    return userDoc.data().pseudo;
  } catch (error) {
    console.error("Error getting user:", error);
  }
}

// Combine both to get user pseudos and scores
export async function getTopUsernamesAndScores(dispatch, level) {
  try {
    const scoresArray = await getAllScores(level);
    const topUsers = scoresArray.sort((a, b) => b.score - a.score).slice(0, 10);

    // Fetch pseudos concurrently using Promise.all
    const usersWithPseudos = await Promise.all(
      topUsers.map(async (user) => {
        const pseudo = await getPseudo(user.uid);
        return { pseudo, score: user.score };
      })
    );
    dispatch({ type: "leaderboard", payload: usersWithPseudos });
  } catch (error) {
    console.error("Error getting top usernames and scores:", error);
  }
}

export async function saveScore(dispatch, { score, uid, level }) {
  const scoresArray = await getAllScores(level);
  const previousScore = scoresArray.find((s) => s.uid === uid)?.score;
  console.log({ previousScore, score });
  if (previousScore < score) {
    const scoresRef = firebaseApp
      .firestore()
      .collection("scores/levels/" + level)
      .doc("list");

    await scoresRef.update({
      [uid]: score,
    });
    getUser(dispatch, uid);
  }
}

const GameStateContext = React.createContext();
const GameDispatchContext = React.createContext();

function commentReducer(state, action) {
  state.error = undefined;
  switch (action.type) {
    case "error":
      return { ...state, error: action.payload };
    case "loading":
      return { ...state, loading: action.payload };
    default: {
      state[action.type] = action.payload;
      return { ...state };
    }
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = React.useReducer(commentReducer, {
    notifications: [],
    error: false,
    loading: false,
    game: null,
    payment_modal: {
      show: false,
      product: undefined,
      onClose: () => undefined,
    },
  });
  return (
    <GameStateContext.Provider value={state}>
      <GameDispatchContext.Provider value={dispatch}>
        {children}
      </GameDispatchContext.Provider>
    </GameStateContext.Provider>
  );
}

export function useGameState() {
  const context = React.useContext(GameStateContext);
  if (context === undefined) {
    throw new Error("useGameState must be used within a GameProvider");
  }
  return context;
}

export function useGameDispatch() {
  const context = React.useContext(GameDispatchContext);
  if (context === undefined) {
    throw new Error("useGameDispatch must be used within a GameProvider");
  }
  return context;
}
