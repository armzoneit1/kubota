/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect } from "react"
import { useRouter } from "next/router"
import { localStorageRemove } from "../utils/localStrorage"
import { authProvider } from "../providers/auth-provider"
import { useMsal } from "@azure/msal-react"

const logout = () => {
  const { instance } = useMsal()
  useEffect(() => {
    authProvider.logout(instance)
  }, [instance])
  return null
}

export default logout
