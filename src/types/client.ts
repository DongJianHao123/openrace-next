
export interface IClient {
  id?: number;
  clientId?: number;
  clientName?: string;
  type?: number;
  status?: number;
  name?: string;
  phone?: string;
  logo?: string;
  password?: string;
  email?: string;
  createdAt?: string | number;
  updatedAt?: string | number;
  homePageInfo?: IHomepageInfo;
  token?: string;
  guidedVideos?: any[];
  menu?: string;
}

export interface IHomepageInfo {
  id: number;
  aboutUsImgUrl?: string;
  aboutUsInfo?: string;
  clientId?: string;
  companyEmail?: string;
  companyName?: string;
  companyPhone?: string;
  companyQrUrl?: string;
  consultUrl?: string;
  coverUrl?: string;
  createdAt?: string | number;
  icpInfo?: string;
  logoUrl?: string;
  status?: number;
  title?: string;
  updatedAt?: string | number;
}
