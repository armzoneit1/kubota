/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../../providers/http-client"
import { useQuery } from "react-query"

export const getListTime = (date: string) => {
  const axios = useAxios()

  return useQuery(
    ["employeeAttendance_listOfTime", date],
    async () => {
      const { data } = await axios.get(
        `/reports/employeeAttendance/listOfTime?date=${date}`
      )

      return data
    },
    {
      keepPreviousData: true,
      staleTime: 0,
      retry: false,
      enabled: !!date,
      refetchOnWindowFocus: false,
    }
  )
}

export const getListBusLine = (date: string) => {
  const axios = useAxios()

  return useQuery(
    ["employeeAttendance_listOfBusLine", date],
    async () => {
      const { data } = await axios.get(
        `/reports/employeeAttendance/listOfBusLine?date=${date}`
      )

      return data
    },
    {
      keepPreviousData: true,
      staleTime: 0,
      retry: false,
      enabled: !!date,
      refetchOnWindowFocus: false,
    }
  )
}

export const getListBookingVehicle = (
  date: string,
  time: string,
  busLineName: string
) => {
  const axios = useAxios()

  return useQuery(
    ["employeeAttendance_listOfBookingVehicle", date, time, busLineName],
    async () => {
      const { data } = await axios.get(
        `/reports/employeeAttendance/listOfBookingVehicle?date=${date}&time=${time}&busLineName=${busLineName}`
      )

      return data
    },
    {
      keepPreviousData: true,
      staleTime: 0,
      retry: false,
      refetchOnWindowFocus: false,
      enabled: !!date && !!time && !!busLineName,
    }
  )
}
