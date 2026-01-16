
import { webRequest } from "@/services/request"
import { Challenge, OpenStatus, PlatformStats, ResponseListType } from "../../types"
import { serverRequest } from "@/services/serverRequest";

export const apiGetChallenges = (params?: Challenge) => {
  return webRequest.post<ResponseListType<Challenge>>(
    "/raceProject/getListPager",
    { ...params, openStatus: OpenStatus.Open },
  );
}

export const apiGetChallengeDetail = (id: number) => {
  return webRequest.post<Challenge>(
    "/raceProject/get",
    { id },
  );
}

export const apiGetRaceStatistics = () => {
  return webRequest.post<PlatformStats>(
    "/raceProject/getStatistics",
  );
}

export const apiGetChanllengeByOrgLoginName = (loginName: string, weight: number) => {
  return webRequest.post<Challenge>(
    "/raceProject/getByLoginNameAndWeight",
    { loginName, weight },
  );
}