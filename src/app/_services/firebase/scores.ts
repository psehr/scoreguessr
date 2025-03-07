"use server";

import { GuessableScore } from "@/src/app/types";
import db from "./session";
import { resolve } from "path";

export async function fetchAllScores() {
  return new Promise<GuessableScore[]>(async (resolve, reject) => {
    db.collection("scores")
      .get()
      .then((snapshot) => {
        const scores: GuessableScore[] = [];
        snapshot.docs.map((doc) => {
          const d = doc.data();
          scores.push(d as GuessableScore);
        });

        resolve(scores.sort((a, b) => a.day_index - b.day_index));
      })
      .catch((e) => reject("could not fetch all scores"));
  });
}

export async function addNewScore(new_score: GuessableScore) {
  return new Promise<GuessableScore>(async (resolve, reject) => {
    db.collection("scores")
      .orderBy("day_index", "desc")
      .get()
      .then((snapshot) => {
        const new_index = snapshot.docs[0]?.data()?.day_index + 1 || 0;
        db.collection("scores")
          .add({ ...new_score, day_index: new_index })
          .then(() => {
            resolve(new_score);
          });
      })
      .catch((e) => reject("could not add score"));
  });
}

export async function fetchCurrentScore() {
  return new Promise<GuessableScore>(async (resolve, reject) => {
    const start_time =
      (await db.collection("static").doc("start_time").get()).data()
        ?.timestamp || Date.now();

    const time_diff = Date.now() - start_time;
    const day_time_diff = Math.floor(time_diff / 86400000);

    const latest_index = await (
      await db.collection("scores").orderBy("day_index", "desc").get()
    ).docs[0]?.data()?.day_index;

    db.collection("scores")
      .where(
        "day_index",
        "==",
        day_time_diff > latest_index ? latest_index : day_time_diff
      )
      .get()
      .then((snapshot) => {
        resolve(snapshot.docs[0].data() as GuessableScore);
      })
      .catch((e) => reject("could not fetch current score"));
  });
}

export async function fetchNextScoreTimestamp() {
  return new Promise<number>(async (resolve, reject) => {
    const start_time =
      (await db.collection("static").doc("start_time").get()).data()
        ?.timestamp || Date.now();

    const time_diff = Date.now() - start_time;
    const day_time_diff = Math.floor(time_diff / 86400000);

    const next_day_time = start_time + (day_time_diff + 1) * 86400000;
    resolve(next_day_time);
  });
}

export async function fetchScoreFromDayIndex(day_index: number) {
  return new Promise<GuessableScore>(async (resolve, reject) => {
    const validScores = await db
      .collection("scores")
      .where("day_index", "==", day_index)
      .get();
    validScores.docs
      ? resolve(validScores.docs[0].data() as GuessableScore)
      : reject();
  });
}
