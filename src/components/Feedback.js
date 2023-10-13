import React, { useCallback, useState } from "react";
import Modal from "./Modal/Modal";
import { Textarea } from "flowbite-react";
import { firebaseApp } from "@/utils/firebase";
import { useGameState } from "@/stores/game.store";
import { toast } from "react-toastify";
import Spinner from "./Spinner";

export function Feedback() {
  const { user } = useGameState();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState("");
  const open = () => {
    setIsOpen(true);
  };
  const close = () => {
    setText("");
    setIsOpen(false);
  };
  const send = useCallback(async () => {
    if (text.length) {
      setIsLoading(true);
      const feedbacksRef = firebaseApp
        .firestore()
        .collection("feedbacks")
        .doc();
      await feedbacksRef.set({
        message: text,
        user,
      });
      setIsLoading(false);
      close();
      toast.success("Thank you for your feedback 🥳");
    }
  }, [text, user]);
  return (
    <div>
      <button
        onClick={open}
        className="z-[400] fixed bottom-5 left-10 bg-blue-600 text-white p-3 px-5 rounded-lg"
      >
        Leave a feedback 💬
      </button>
      <Modal show={isOpen} dismissible onClose={close} style={{ zIndex: 400 }}>
        <div className="w-12/12 sm:w-8/12 md:w-6/12 lg:w-4/12 xl:w-3/12 bg-white rounded-lg shadow-lg p-5 z-[400]">
          <h4 className="text-center text-2xl">Feedback</h4>
          <p className="mt-10 mb-4 text-center">
            Hi {user?.pseudo} 👋🏾, Your thoughts are invaluable to us and we’d
            love to hear more about your experiences 😁.
          </p>
          <Textarea
            placeholder="Write your message here"
            onChange={(e) => setText(e.target.value)}
          />
          <div className="flex gap-3 mt-4">
            <button
              onClick={close}
              className="w-full bg-slate-200 text-slate-800 mt-2 rounded-md p-2"
            >
              Cancel
            </button>
            <button
              disabled={!text.length}
              onClick={send}
              className="w-full disabled:text-slate-500 disabled:bg-slate-300 bg-blue-500 text-white mt-2 rounded-md p-2"
            >
              {isLoading ? <Spinner className="fill-white" /> : <>Send</>}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
