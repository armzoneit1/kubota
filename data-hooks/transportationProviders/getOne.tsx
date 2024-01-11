/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../providers/http-client"
import { useQuery } from "react-query"
import { VehicleTypes } from "./types"

export const getOneForTab = (providerId: string | string[] | undefined) => {
  const axios = useAxios()

  return useQuery(
    ["tab_transportationProvider", providerId],
    async () => {
      const { data } = await axios.get(`/transportationProviders/${providerId}`)

      return data
    },
    {
      keepPreviousData: true,
      staleTime: 0,
      retry: false,
      enabled: !!providerId,
      refetchOnWindowFocus: false,
    }
  )
}

export const getOne = (providerId: string | string[] | undefined) => {
  const axios = useAxios()

  return useQuery(
    ["transportationProvider", providerId],
    async () => {
      const { data } = await axios.get(`/transportationProviders/${providerId}`)
      const vehicleTypes = data.data.vehicleTypes.map(
        (vehicle: VehicleTypes) => {
          return {
            ...vehicle,
            vehicleTypeId: {
              value: vehicle.vehicleTypeId,
              label: vehicle.vehicleTypeName,
            },
          }
        }
      )
      data.data.status = data.data.status ? "active" : "inactive"
      data.data.vehicleTypes = vehicleTypes
      data.data.province = data.data.province
        ? { value: data.data.province, label: data.data.province }
        : null
      return data
    },
    {
      keepPreviousData: true,
      staleTime: 0,
      retry: false,
      enabled: !!providerId,
      refetchOnWindowFocus: false,
    }
  )
}
