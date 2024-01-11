/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../../providers/http-client"
import { useQuery } from "react-query"

export const getListTime = (startDate: string, endDate: string) => {
  const axios = useAxios()

  return useQuery(
    ["summaryTotalVehicle_listOfTime", startDate, endDate],
    async () => {
      const { data } = await axios.get(
        `/reports/summaryTotalVehicle/listOfTime?startDate=${startDate}&endDate=${endDate}`
      )

      return data
    },
    {
      keepPreviousData: true,
      staleTime: 0,
      retry: false,
      enabled: !!startDate && !!endDate,
      refetchOnWindowFocus: false,
    }
  )
}

export const getListTransportationProvider = (
  startDate: string,
  endDate: string
) => {
  const axios = useAxios()

  return useQuery(
    ["summaryTotalVehicle_listOfTransportationProvider", startDate, endDate],
    async () => {
      const { data } = await axios.get(
        `/reports/summaryTotalVehicle/listOfTransportationProvider?startDate=${startDate}&endDate=${endDate}`
      )

      return data
    },
    {
      keepPreviousData: true,
      staleTime: 0,
      retry: false,
      enabled: !!startDate && !!endDate,
      refetchOnWindowFocus: false,
    }
  )
}

export const getListTransportationProviderVehicleTypeMapping = (
  startDate: string,
  endDate: string
) => {
  const axios = useAxios()

  return useQuery(
    ["summaryTotalVehicle_listOfTransportationProviderVehicleTypeMapping"],
    async () => {
      const { data } = await axios.get(
        `/reports/summaryTotalVehicle/listOfTransportationProviderVehicleTypeMapping?startDate=${startDate}&endDate=${endDate}`
      )

      return data
    },
    {
      keepPreviousData: true,
      staleTime: 0,
      retry: false,
      refetchOnWindowFocus: false,
      enabled: !!startDate && !!endDate,
    }
  )
}
export const getListVehicle = (startDate: string, endDate: string) => {
  const axios = useAxios()

  return useQuery(
    ["summaryTotalVehicle_listOfVehicle"],
    async () => {
      const { data } = await axios.get(
        `/reports/summaryTotalVehicle/listOfVehicle?startDate=${startDate}&endDate=${endDate}`
      )

      return data
    },
    {
      keepPreviousData: true,
      staleTime: 0,
      retry: false,
      refetchOnWindowFocus: false,
      enabled: !!startDate && !!endDate,
    }
  )
}
