/* eslint-disable @next/next/no-css-tags */

import { CompleteProfileModal } from "@/components/Modal/CompleteProfileModal";
import { LoginModal } from "@/components/Modal/LoginModal";
import { Game } from "@/components/game/Game";
import { useAuth } from "@/stores/auth.store";
import { getUser, useGameDispatch, useGameState } from "@/stores/game.store";
import { useEffect } from "react";

export default function Home() {
  const { authUser } = useAuth();
  const { user, loading } = useGameState();
  const dispatch = useGameDispatch();
  useEffect(() => {
    if (authUser) getUser(dispatch, authUser.uid);
  }, [authUser, dispatch]);
  return (
    <div>
      <LoginModal />
      <CompleteProfileModal />
      <Game user={user} />
    </div>
  );
}
