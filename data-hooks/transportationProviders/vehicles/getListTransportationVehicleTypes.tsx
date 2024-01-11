/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../../providers/http-client"
import { useQuery } from "react-query"
import { TransportationVehicleTypes } from "./types"

export type Option = {
  value: string | number
  label: string
  seatCapacity: string | number
}

export const getListTransportationVehicleTypes = (
  providerId: string | string[] | undefined
) => {
  const axios = useAxios()

  return useQuery(
    "getListTransportationVehicleTypes",
    async () => {
      const { data } = await axios.get(
        `/transportationProviders/${providerId}/vehicleTypes`
      )

      const filteredData = data.data.reduce(
        (acc: Option[], curr: TransportationVehicleTypes) => {
          acc.push({
            value: curr.id,
            label: curr.vehicleTypeName,
            seatCapacity: curr.seatCapacity,
          })

          return acc
        },
        []
      )

      return {
        ...data,
        data: filteredData,
      }
    },
    {
      keepPreviousData: true,
      staleTime: 0,
      retry: false,
      refetchOnWindowFocus: false,
      enabled: !!providerId,
    }
  )
}
