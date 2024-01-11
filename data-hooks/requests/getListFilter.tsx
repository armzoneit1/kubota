/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../providers/http-client"
import { useQuery } from "react-query"

export const getListOfPeriodOfDay = () => {
  const axios = useAxios()

  return useQuery(
    "listOfPeriodOfDay",
    async () => {
      const { data } = await axios.get(`/requests/listOfPeriodOfDay`)

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

export const getListOfBookingStatus = () => {
  const axios = useAxios()

  return useQuery(
    "listOfBookingStatus",
    async () => {
      const { data } = await axios.get(`/requests/listOfBookingStatus`)

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

export const getListOfBusLine = (startDate: string, endDate: string) => {
  const axios = useAxios()

  return useQuery(
    ["listOfBusLine", startDate, endDate],
    async () => {
      const { data } = await axios.get(
        `/requests/listOfBusLine?startDate=${startDate}&endDate=${endDate}`
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

export const getListOfTime = (
  startDate: string,
  endDate: string,
  periodOfDay: string
) => {
  const axios = useAxios()

  return useQuery(
    ["listOfTime", startDate, endDate, periodOfDay],
    async () => {
      const { data } = await axios.get(
        `/requests/listOfTime?startDate=${startDate}&endDate=${endDate}&periodOfDay=${periodOfDay}`
      )

      return data
    },
    {
      keepPreviousData: true,
      staleTime: 0,
      retry: false,
      refetchOnWindowFocus: false,
      enabled: !!startDate && !!endDate && !!periodOfDay,
    }
  )
}

export const getListOfPassenger = (startDate: string, endDate: string) => {
  const axios = useAxios()

  return useQuery(
    ["listOfPassenger", startDate, endDate],
    async () => {
      const { data } = await axios.get(
        `/requests/listOfPassenger?startDate=${startDate}&endDate=${endDate}`
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

export const getListOfBusStop = (startDate: string, endDate: string) => {
  const axios = useAxios()

  return useQuery(
    ["listOfBusStop", startDate, endDate],
    async () => {
      const { data } = await axios.get(
        `/requests/listOfBusStop?startDate=${startDate}&endDate=${endDate}`
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
