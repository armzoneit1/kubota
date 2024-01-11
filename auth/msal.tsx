/* eslint-disable react-hooks/rules-of-hooks */
import { PublicClientApplication } from "@azure/msal-browser"
import { msalConfig } from "./authConfig"
import { useEffect } from "react"
import { EventType } from "@azure/msal-browser"
import { localStorageRemove } from "../utils/localStrorage"

export const msalInstance = () => {
  const msalInstance = new PublicClientApplication(msalConfig)
  msalInstance.addEventCallback((message) => {
    if (message.eventType === EventType.LOGOUT_SUCCESS) {
      localStorageRemove("token")
    }
  })

  return msalInstance
}

export const instance = msalInstance()
