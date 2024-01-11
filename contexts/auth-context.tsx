import { createContext } from "react"
import { IPublicClientApplication, AccountInfo } from "@azure/msal-browser"

interface AuthContextType {
  user?: AccountInfo
  loading: boolean
  token: string
  isAuthenticated?: boolean
  error?: any
  login: (instance: IPublicClientApplication) => any
  logout: (instance: IPublicClientApplication) => void
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType)
