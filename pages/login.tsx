import {
  Flex,
  Box,
  Stack,
  Button,
  Text,
  Center,
  Spinner,
} from "@chakra-ui/react"
import router from "next/router"
import { useForm } from "react-hook-form"
import { useMsal, useIsAuthenticated } from "@azure/msal-react"
import {
  InteractionStatus,
  IPublicClientApplication,
  AccountInfo,
} from "@azure/msal-browser"
import Head from "next/head"
import { authProvider } from "../providers/auth-provider"
import { useState, useEffect } from "react"
import NextImage from "next/image"
import LoginDialog from "../components/LoginDialog"
import { AccountMeDataTypes } from "../data-hooks/me/types"
import { loginRequest } from "../auth/authConfig"
import {
  localStorageSave,
  localStorageLoad,
  localStorageRemove,
} from "../utils/localStrorage"
import Axios from "axios"

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
      })
    })
}

const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_END_POINT,
  headers: { Accept: "application/json" },
})

const LoginPage = () => {
  const { instance, accounts, inProgress, logger } = useMsal()
  const [isLoading, setLoading] = useState(false)
  const [isOpen, setOpen] = useState(false)
  const token =
    typeof window !== "undefined" ? localStorageLoad("token") : undefined
  const [accountMe, setAccountMe] = useState<AccountMeDataTypes | null>(null)
  const onClose = () => {
    setOpen(false)
  }
  const activeAccount = instance.getActiveAccount()
  const currentAccounts = instance.getAllAccounts()

  const isAuthenticated = useIsAuthenticated(
    accounts[0] ? accounts[0] : currentAccounts[0]
  )

  useEffect(() => {
    setLoading(true)
    if (InteractionStatus.None === inProgress) {
      if (
        isAuthenticated ||
        accounts.length > 0 ||
        currentAccounts.length > 0 ||
        activeAccount
      ) {
        instance.handleRedirectPromise().then((s) => {
          if (
            currentAccounts.length > 0 ||
            accounts.length > 0 ||
            activeAccount
          ) {
            requestAccessToken(
              instance,
              currentAccounts.length > 0 ? currentAccounts : accounts
            )
              .then((token) => {
                return axios
                  .get("/account/me", {
                    headers: { Authorization: `Bearer ${token}` },
                  })
                  .catch(() => {
                    localStorageRemove("token")
                    router.push(
                      `https://login.microsoftonline.com/common/oauth2/logout?post_logout_redirect_uri=${process.env.NEXT_PUBLIC_POST_LOGIN_REDIRECT_URL}`
                    )
                  })
              })
              .then((me) => {
                return me?.data
              })
              .then((data) => {
                setAccountMe(data?.data)
                if (
                  data?.data &&
                  data?.data?.planningBusUser !== null &&
                  data?.data?.planningBusUser?.status === true
                ) {
                  setLoading(false)
                  setOpen(true)
                } else
                  router.push(
                    data?.data?.bookingBusUser
                      ? "/employee/requests"
                      : "/employee/registration/register"
                  )
              })
          } else {
            setLoading(false)
          }
        })
      } else {
        setLoading(false)
        localStorageRemove("token")
      }
    }
  }, [instance, accounts, inProgress, token, isAuthenticated])

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    control,
  } = useForm()

  const onSubmit = async (values: any) => {
    setLoading(true)
    await authProvider.login(instance).catch(() => {
      setLoading(false)
    })
  }

  if (isLoading)
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
    <>
      <Head>
        <title>login</title>
        <meta name="description" content="login" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <LoginDialog isOpen={isOpen} onClose={onClose} accountMe={accountMe} />
      <Flex minH="100vh" align="center" justify="center" bgColor="#EDF2F7">
        <Stack spacing={8} mx="auto" w="2xl" py={12} px={6}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box borderRadius="8px" bgColor="#F9F9F9" p={4}>
              <Flex mb="40px">
                <NextImage
                  src="/assets/image/kubota-logo.png"
                  alt="logo"
                  height={54}
                  width={135}
                />
              </Flex>
              <Stack spacing={14} align="center" px={12} py={8}>
                <Text
                  fontSize={{ base: "32px", md: "36px" }}
                  fontWeight={700}
                  color="primary.500"
                >
                  Car Pool Service
                </Text>
                <Flex justifyContent="center">
                  <Button
                    type="submit"
                    isLoading={isSubmitting}
                    _focus={{ boxShadow: "none" }}
                    _hover={{ background: "#00A5A8" }}
                    background="#00A5A8"
                    rightIcon={
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1.25 10C1.25 11.7306 1.76318 13.4223 2.72464 14.8612C3.6861 16.3002 5.05267 17.4217 6.65152 18.0839C8.25037 18.7462 10.0097 18.9195 11.707 18.5819C13.4044 18.2442 14.9635 17.4109 16.1872 16.1872C17.4109 14.9635 18.2442 13.4044 18.5819 11.707C18.9195 10.0097 18.7462 8.25037 18.0839 6.65152C17.4217 5.05267 16.3002 3.6861 14.8612 2.72464C13.4223 1.76318 11.7306 1.25 10 1.25C7.67936 1.25 5.45376 2.17187 3.81282 3.81282C2.17187 5.45376 1.25 7.67936 1.25 10ZM5 9.375H12.5938L9.10625 5.87062L10 5L15 10L10 15L9.10625 14.1081L12.5938 10.625H5V9.375Z"
                          fill="#FEFEFE"
                        />
                      </svg>
                    }
                  >
                    เข้าใช้งานระบบ
                  </Button>
                </Flex>
              </Stack>
            </Box>
          </form>
        </Stack>
      </Flex>
    </>
  )
}

export default LoginPage
