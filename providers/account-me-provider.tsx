import { useContext } from "react"
import { RouteGuardContext } from "../contexts/route-guard-context"

export const useAccountMe = () => {
  return useContext(RouteGuardContext)
}
