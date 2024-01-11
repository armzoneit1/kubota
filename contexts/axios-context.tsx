import { createContext } from "react"
import Axios, { AxiosInstance } from "axios"

export const AxiosContext = createContext<AxiosInstance>(Axios)
