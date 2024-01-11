import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import {
  localStorageLoad,
  localStorageRemove,
  localStorageSave,
} from "../utils/localStrorage"
import { authProvider } from "../providers/auth-provider"
import { useMsal } from "@azure/msal-react"
import { RouteGuardContext } from "../contexts/route-guard-context"
import { getMeRouteGuard } from "../data-hooks/me/getMe"
import { Flex, Center, Spinner, useToast } from "@chakra-ui/react"
import get from "lodash/get"
import { IPublicClientApplication, AccountInfo } from "@azure/msal-browser"
import { loginRequest } from "./authConfig"

function requestAccessToken(
  instance: IPublicClientApplication,
  accounts: AccountInfo[]
) {
  const request = {
    ...loginRequest,
    account: accounts[0],
  }

  return instance
    .acquireTokenSilent(request)
    .then((response) => {
      localStorageSave("token", response.accessToken)
      return response.accessToken
    })
    .catch((e) => {
      instance.acquireTokenPopup(request).then((response) => {
        localStorageSave("token", response.accessToken)
        return response.accessToken
      })
    })
}

const RouteGuard = ({ children }: React.PropsWithChildren<unknown>) => {
  const router = useRouter()
  const { instance, accounts } = useMsal()
  const isAuthenticated =
    typeof window !== "undefined" ? !!localStorageLoad("token") : false
  const token =
    typeof window !== "undefined" ? localStorageLoad("token") : undefined
  const [authorized, setAuthorized] = useState(false)
  const [isExp, setIsExp] = useState(false)
  const me = getMeRouteGuard(token)
  const toast = useToast()
  const toastId1 = "error_me"
  const toastId2 = "not_premission"

  useEffect(() => {
    if (me.error || me.data?.error) {
      if (
        !toast.isActive(toastId1) &&
        router.pathname !== "/login" &&
        get(me, "error.status") !== 401
      ) {
        toast({
          id: toastId1,
          description: me.data?.error?.message
            ? me.data?.error?.message
            : `${get(me, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
        router.push("/login")
      }
    }
  }, [me.error, me.data?.error, toast])

  useEffect(() => {
    const path = `${router.pathname}`.split("/")
    if (me?.data?.data)
      if (
        me.data?.data?.planningBusUser === null ||
        !me.data?.data?.planningBusUser?.status
      ) {
        if (!toast.isActive(toastId2) && path[1] === "admin") {
          toast({
            id: toastId2,
            description: `ไม่มีสิทธิ์เข้าถึง`,
            status: "error",
            duration: 5000,
            isClosable: false,
          })
          router.push("/login")
        }
      }
  }, [me.data, toast, router.pathname])

  useEffect(() => {
    if (isAuthenticated) {
      if (!authProvider.checkAuth() && !isExp) {
        if (router.pathname !== "/login")
          requestAccessToken(instance, accounts)
            .then((token) => {
              if (!!token) {
                setAuthorized(true)
                setIsExp(false)
              } else {
                setIsExp(true)
                setAuthorized(false)

                if (router.pathname !== "/login") {
                  localStorageRemove("token")
                  router.push(
                    `https://login.microsoftonline.com/common/oauth2/logout?post_logout_redirect_uri=${process.env.NEXT_PUBLIC_POST_LOGIN_REDIRECT_URL}`
                  )
                }
              }
            })
            .catch(() => {
              setIsExp(true)
              setAuthorized(false)
            })
      } else {
        setIsExp(false)
        setAuthorized(true)
      }
    } else {
      authCheck(router.pathname, "router")
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instance, isAuthenticated, router.pathname])

  function authCheck(url: any, from: string) {
    const publicPaths = ["/login"]
    const path = url.split("?")[0]
    if (!isAuthenticated && !publicPaths.includes(path)) {
      setAuthorized(false)
      router.push(
        {
          pathname: "/login",
        },
        undefined,
        { shallow: true }
      )
    } else {
      setAuthorized(true)
    }
  }

  if (me.isLoading || me.isFetching)
    return (
      <Flex
        alignItems="center"
        width="100%"
        height="100vh"
        justifyContent="center"
      >
        <Center>
          <Spinner size="xl" color="primary.500" />
        </Center>
      </Flex>
    )

  return (
    <RouteGuardContext.Provider
      value={isAuthenticated ? me?.data?.data : undefined}
    >
      {authorized && children}
    </RouteGuardContext.Provider>
  )
}

export default RouteGuard
