import { useAuth } from "@/stores/auth.store";
import Image from "next/image";
import Modal from "./Modal";

export const LoginModal = () => {
  const { authUser, loading, signInWithGoogle, signInAnonymously } = useAuth();
  return (
    <Modal dismissible={false} show={!authUser}>
      <div className="w-12/12 sm:w-8/12 md:w-6/12 lg:w-4/12 xl:w-3/12 bg-white rounded-lg shadow-lg p-5">
        <h2 className="text-2xl font-semibold p-4 text-center ">
          Authentication
        </h2>
        <div className="p-4 flex justify-center items-center flex-col gap-8">
          <span className="text-sm">
            Hello 👋🏾 and welcome to Dactylo 😊.
            <br />
            Are you the fastest? Try to take the first place 😉.
          </span>
          <button
            onClick={signInWithGoogle}
            className="px-4 py-2 border flex gap-2 border-slate-200 rounded-lg text-slate-700 hover:border-slate-400 hover:text-slate-900 hover:shadow transition duration-150"
          >
            <Image
              width={24}
              height={24}
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              loading="lazy"
              alt="google logo"
            />
            <span>Continue with Google</span>
          </button>
          <button
            onClick={signInAnonymously}
            className="px-4 py-2 border flex gap-2 border-slate-200 rounded-lg text-slate-700 hover:border-slate-400 hover:text-slate-900 hover:shadow transition duration-150"
          >
            <span>🕶️ Continue anonymously</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
