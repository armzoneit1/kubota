import { loginRequest } from "../auth/authConfig"
import {
  localStorageSave,
  localStorageLoad,
  localStorageRemove,
} from "../utils/localStrorage"
import router from "next/router"
import { IPublicClientApplication, AccountInfo } from "@azure/msal-browser"
import { AuthenticationResult } from "@azure/msal-common"
import jwtDecode, { JwtPayload } from "jwt-decode"
import Axios from "axios"

const authProvider = {
  login: async (instance: IPublicClientApplication) => {
    const axios = Axios.create({
      baseURL: process.env.NEXT_PUBLIC_END_POINT,
      headers: { Accept: "application/json" },
    })

    return instance.loginRedirect({ ...loginRequest }).catch((e: Error) => {
      throw e
    })
  },
  logout: async (instance: IPublicClientApplication) => {
    return instance.logoutRedirect().catch((e: Error) => {
      throw e
    })
  },
  checkAuth: () => {
    const token =
      typeof window !== "undefined" ? localStorageLoad("token") : null

    if (token == null) {
      return false
    }

    const jwt: JwtPayload = jwtDecode(token)
    const currentTimestamp = Math.ceil(Date.now() / 1000)

    if (jwt?.exp && currentTimestamp >= jwt?.exp) {
      return false
    }

    return true
  },
  checkAccount: (account: AccountInfo) => {
    if (account) return true
    else {
      localStorageRemove("token")
      router.push(
        {
          pathname: "/login",
        },
        undefined,
        { shallow: true }
      )
    }
  },
}

export { authProvider }
