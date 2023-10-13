/* eslint-disable import/no-anonymous-default-export */
import db from "../../utils/db";

export default async (req, res) => {
  try {
    let words = {};
    for (let id of [1, 2, 3]) {
      const entries = await db.collection("levels/" + id + "/lang").get();
      const levels = entries.docs.map((entry) => ({
        [entry.id]: entry.data(),
      }));
      words[id] = { ...levels[0], ...levels[1] };
    }
    res.status(200).json(words);
  } catch (e) {
    console.error(e.message);
    res.status(400).end();
  }
};
