interface TempCredentials {
  CustomUrl: string;
  TmpSecretId: string;
  TmpSecretKey: string;
  SessionToken: string;
  StartTime: number;
  ExpiredTime: number;
  Bucket: string;
  Region: string;
  Key: string;
}

export const getOssTempConfig = (filename: string) => {
  return fetch(
    `https://opencamp.cn/api/oss/keyAndCredentials?filename=${filename}`,
    {
      method: "GET",
    }
  ).then((res) => res.json() as Promise<TempCredentials>);
};
