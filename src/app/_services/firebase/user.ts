"use server";

import { resolve } from "path";
import { GuessableScore, ScoreguessrUser, ScoreSimple } from "../../types";
import dbSession from "./session";

export async function checkIfScoreHasAlreadyBeenFound(
  user_id: number,
  score_id: number
) {
  return new Promise<boolean>(async (resolve, reject) => {
    const dbUser = dbSession.collection("users").doc(user_id.toString());
    dbUser.get().then((d) => {
      const oldFoundScores: ScoreSimple[] = d.data()?.found_scores || [];
      oldFoundScores.find((oldScore) => oldScore.score_id == score_id)
        ? resolve(true)
        : resolve(false);
    });
  });
}

export async function addFoundScoreToUser(
  score: GuessableScore,
  user_id: number,
  guess_count: number
) {
  return new Promise<boolean>((resolve, reject) => {
    const dbUser = dbSession.collection("users").doc(user_id.toString());

    dbUser.get().then((d) => {
      const oldFoundScores: ScoreSimple[] = d.data()?.found_scores || [];
      const newFoundScores = [
        ...oldFoundScores,
        {
          score_id: score.id,
          day_index: score.day_index,
          guess_count: guess_count,
        },
      ];

      dbUser
        .update({
          found_scores: newFoundScores,
        })
        .then(() => resolve(true));
    });
  });
}

export async function updateUserStatsAfterFoundScore(
  user_id: number,
  score: ScoreSimple
) {
  return new Promise<boolean>(async (resolve, reject) => {
    const dbUser = dbSession.collection("users").doc(user_id.toString());

    dbUser.get().then((d) => {
      const oldStats = d.data()?.stats;

      const newStats = {
        total_found_scores: oldStats.total_found_scores + 1,
        total_guesses: oldStats.total_guesses + score.guess_count,
        avg_guesses:
          oldStats.avg_guesses > 0
            ? (oldStats.avg_guesses + score.guess_count) / 2
            : score.guess_count,
      };

      dbUser.update({ stats: newStats }).then(() => resolve(true));
    });
  });
}
