import { useAuth } from "@/stores/auth.store";
import Modal from "./Modal";
import {
  updateProfile,
  useGameDispatch,
  useGameState,
} from "@/stores/game.store";
import { useCallback, useState } from "react";
import Spinner from "../Spinner";

export const CompleteProfileModal = () => {
  const { authUser } = useAuth();
  const { loading, user } = useGameState();
  const dispatch = useGameDispatch();
  const [pseudo, setPseudo] = useState();
  const save = useCallback(() => {
    updateProfile(dispatch, {
      ...authUser,
      level: 1,
      pseudo,
    });
  }, [dispatch, authUser, pseudo]);
  return (
    <Modal dismissible={false} show={authUser && !user?.pseudo}>
      <div className="w-12/12 sm:w-8/12 md:w-6/12 lg:w-4/12 xl:w-3/12 bg-white rounded-lg shadow-lg p-5 ">
        <h2 className="text-2xl font-light p-4 text-center mb-5 ">
          Complete your profile
        </h2>
        <div className="text-center">
          <div className="text-base  my-3">
            Hi again 👋🏾, we will need a pseudo 😊
          </div>
          <div>
            <input
              onChange={(e) => setPseudo(e.target.value)}
              autoFocus
              defaultValue={user?.pseudo || authUser?.displayedName}
              className="border-blue-400 w-full border-2 rounded-md p-2 text-center"
              placeholder="Enter a pseudo"
            />
          </div>
          <button
            onClick={save}
            disabled={loading}
            className="p-2 mt-4 rounded-md w-full bg-blue-500 hover:bg-blue-600 text-white"
          >
            {loading ? <Spinner /> : "Save"}
          </button>
        </div>
      </div>
    </Modal>
  );
};
