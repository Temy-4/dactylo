/* eslint-disable @next/next/no-css-tags */

import { Feedback } from "@/components/Feedback";
import { CompleteProfileModal } from "@/components/Modal/CompleteProfileModal";
import { LoginModal } from "@/components/Modal/LoginModal";
import { Game } from "@/components/game/Game";
import { useAuth } from "@/stores/auth.store";
import { getUser, useGameDispatch, useGameState } from "@/stores/game.store";
import Head from "next/head";
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
      <Head>
        <title>Dactylo — {"Let's test your speed"}</title>
        <meta property="og:title" content="Dactylo — Let's test your speed" />
        <meta
          property="og:image"
          content="https://dactylo.djopa.fr/banner.png"
        />
        <meta property="og:url" content="https://dactylo.djopa.fr" />
        <meta property="og:site_name" content="Dactylo" />
        <meta
          property="og:description"
          content="Are you a fast typer ? Come and test yourself with Dactylo"
        />
        <meta name="twitter:title" content="Dactylo — Let's test your speed" />
        <meta
          name="twitter:image"
          content="https://dactylo.djopa.fr/banner.png"
        />
        <meta name="twitter:url" content="https://dactylo.djopa.fr" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="https://dactylo.djopa.fr/logo.png"
        />
        <link
          rel="mask-icon"
          href="https://dactylo.djopa.fr/logo.png"
          color="#3F83F8"
        />
        <meta name="msapplication-TileColor" content="#3F83F8" />
        <meta name="theme-color" content="#3F83F8" />
      </Head>
      <Feedback />
      <div className="hidden lg:block">
        <LoginModal />
        <CompleteProfileModal />
        <Game user={user} />
      </div>
      <div className="flex justify-center h-screen w-screen items-center lg:hidden">
        <div className=" bg-white w-8/12 p-10 shadow-lg">
          Hello 👋🏾,
          <br />
          <br />
          Welcome to Dactylo. It seems that you are on a small screen. To have a
          better experience with us, we encourage you to use a larger screen. A
          computer screen for example or you could zoom out to have more space.
          <br />
          <br />
          Thank you,
        </div>
      </div>
    </div>
  );
}
