/* eslint-disable import/no-anonymous-default-export */
import db from "@/utils/db";

export default async (req, res) => {
  try {
    const { id } = req.query;
    const usersRef = await db.collection("users").doc(id);
    const user = await usersRef.get();
    res.status(200).json(user);
  } catch (e) {
    res.status(400).end();
  }
};
