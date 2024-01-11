export const msalConfig = {
  auth: {
    clientId: process.env.NEXT_PUBLIC_AUTH_CLIENT_ID
      ? process.env.NEXT_PUBLIC_AUTH_CLIENT_ID
      : "",
    authority: process.env.NEXT_PUBLIC_AUTH_AUTHORITY,
    redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URL,
    postLogoutRedirectUri: process.env.NEXT_PUBLIC_POST_LOGOUT_REDIRECT_URL,
    navigateToLoginRequestUrl:
      process.env.NEXT_PUBLIC_NAVIGATE_TO_LOGIN_REQUEST_URL === "true"
        ? true
        : false,
  },
  cache: {
    cacheLocation: process.env.NEXT_PUBLIC_CACHE_CACHE_LOCATION,
    storeAuthStateInCookie:
      process.env.NEXT_PUBLIC_CACHE_STORE_AUTH_STATE_IN_COOKIE === "true"
        ? true
        : false,
  },
}

export const loginRequest = {
  scopes: process.env.NEXT_PUBLIC_LOGIN_REQUEST_SCOPES
    ? process.env.NEXT_PUBLIC_LOGIN_REQUEST_SCOPES?.split(", ")
    : [],
  redirectStartPage: process.env.NEXT_PUBLIC_POST_LOGIN_REDIRECT_URL,
}

export const graphConfig = {
  graphMeEndpoint: process.env.NEXT_PUBLIC_GRAPH_ME_END_POINT,
}
