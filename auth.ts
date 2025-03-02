import NextAuth from "next-auth";
import Osu, { OsuProfile } from "next-auth/providers/osu";
import { newUser, OsuUser } from "./src/app/types";
import dbSession from "./src/app/_services/firebase/session";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Osu],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ profile }) {
      const osuProfile = profile as unknown as OsuProfile;
      const dbUserExists = (
        await dbSession.collection("users").doc(osuProfile.id.toString()).get()
      ).exists;
      if (!dbUserExists) {
        dbSession
          .collection("users")
          .doc(osuProfile.id.toString())
          .create(
            newUser({
              id: osuProfile.id,
              name: osuProfile.username,
              image: osuProfile.avatar_url,
              country_code: osuProfile.country_code,
            })
          );
      }
      return true;
    },
  },
});
