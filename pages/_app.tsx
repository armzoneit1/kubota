import "../styles/globals.css"
import "../styles/react-datepicker.css"
import type { AppProps } from "next/app"
import { QueryClient, QueryClientProvider } from "react-query"
import {
  CSSReset,
  extendTheme,
  withDefaultColorScheme,
  ChakraProvider,
} from "@chakra-ui/react"
import Layout from "../components/layout/Layout"
import AxiosProvider from "../providers/axios-provider"
import { MsalProvider } from "@azure/msal-react"
import RouteGuard from "../auth/routeGuard"
import { instance } from "../auth/msal"

const queryClient = new QueryClient()

const customTheme = extendTheme(
  {
    colors: {
      primary: {
        400: "#B2CCCC",
        500: "#00A5A8",
        600: "#008c8e",
      },
      white: {
        500: "#FFFFFF",
      },
      error: {
        500: "#D61212",
        600: "#D61212",
      },
    },
    fonts: {
      body: "Sarabun",
      heading: "Sarabun",
      mono: "Sarabun",
    },
    styles: {
      global: {
        body: {
          bg: "#ffffff",
          minHeight: "100vh!important",
          margin: 0,
          padding: 0,
        },
        "#__next": {
          minHeight: "100vh!important",
        },
      },
    },
  },
  withDefaultColorScheme({ colorScheme: "primary" })
)

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MsalProvider instance={instance}>
      <AxiosProvider>
        <QueryClientProvider client={queryClient}>
          <ChakraProvider theme={customTheme}>
            <RouteGuard>
              <CSSReset />
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </RouteGuard>
          </ChakraProvider>
        </QueryClientProvider>
      </AxiosProvider>
    </MsalProvider>
  )
}
export default MyApp
