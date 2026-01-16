import { serverRequest } from "@/services/serverRequest";
import { Challenge } from "@/types";

export const apiGetServerChallengeByOrgLoginName = (loginName: string, weight: number) => {
  return serverRequest.post<Challenge>(
    "/raceProject/getByLoginNameAndWeight",
    { loginName, weight },
  );
}