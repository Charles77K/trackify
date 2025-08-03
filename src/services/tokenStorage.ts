// Base token storage class
class BaseTokenStorage {
  getAccessToken = () => sessionStorage.getItem("accessToken");
  getRefreshToken = () => localStorage.getItem("refreshToken");

  setTokens = ({
    accessToken,
    refreshToken,
  }: {
    accessToken: string;
    refreshToken: string;
  }) => {
    sessionStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  };

  clearTokens = () => {
    sessionStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };
}
const TokenStorage = new BaseTokenStorage();
export default TokenStorage;
