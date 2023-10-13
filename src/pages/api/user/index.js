/* eslint-disable import/no-anonymous-default-export */
import db from "@/utils/db";

export default async (req, res) => {
  try {
    console.log("uid", req.body.uid);
    const usersRef = await db.collection("users").doc(req.body.uid);
    await usersRef.set(req.body);
    const user = await usersRef.get();
    res.status(200).json(user.data());
  } catch (e) {
    res.status(400).end();
  }
};
