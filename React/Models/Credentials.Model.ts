export class Credentials {
  accessToken: string;
  refreshToken: string;
  constructor(data: any) {
    this.accessToken = data.accessToken;
    this.refreshToken = data.refreshToken;
  }
}
