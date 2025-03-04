"use server";

import { GuessableScore, ScoreguessrUser } from "../../types";
import dbSession from "./session";
export type ScoreSimple = {
  score_id: number;
  day_index: number;
  guess_count: number;
};

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

      if (oldFoundScores.find((oldScore) => oldScore.score_id == score.id)) {
        resolve(true);
      } else {
        dbUser.update({
          found_scores: newFoundScores,
        });
        resolve(true);
      }
    });
  });
}
