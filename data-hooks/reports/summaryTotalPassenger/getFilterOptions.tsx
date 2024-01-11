/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../../providers/http-client"
import { useQuery } from "react-query"

export const getListTime = (startDate: string, endDate: string) => {
  const axios = useAxios()

  return useQuery(
    ["summaryTotalPassenger_listOfTime", startDate, endDate],
    async () => {
      const { data } = await axios.get(
        `/reports/summaryTotalPassenger/listOfTime?startDate=${startDate}&endDate=${endDate}`
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

export const getListBusLine = (startDate: string, endDate: string) => {
  const axios = useAxios()

  return useQuery(
    ["summaryTotalPassenger_listOfBusLine", startDate, endDate],
    async () => {
      const { data } = await axios.get(
        `/reports/summaryTotalPassenger/listOfBusLine?startDate=${startDate}&endDate=${endDate}`
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

export const getListTypeOfTotalPassenger = () => {
  const axios = useAxios()

  return useQuery(
    ["summaryTotalPassenger_typeOfTotalPassenger"],
    async () => {
      const { data } = await axios.get(
        `/reports/summaryTotalPassenger/typeOfTotalPassenger`
      )

      return data
    },
    {
      keepPreviousData: true,
      staleTime: 0,
      retry: false,
      refetchOnWindowFocus: false,
    }
  )
}
