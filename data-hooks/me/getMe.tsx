/* eslint-disable react-hooks/rules-of-hooks */
import { useQuery } from "react-query"
import { EmployeeUsageInfoDataTypes } from "./types"
import { useAxios } from "../../providers/http-client"

export const getMe = () => {
  const axios = useAxios()

  return useQuery(
    ["me"],
    async () => {
      const { data } = await axios.get(`/account/me`)
      const employeeUsageInfos: EmployeeUsageInfoDataTypes[] =
        data?.data?.bookingBusUser?.employeeUsageInfos

      const employeeUsageInfo: any =
        employeeUsageInfos &&
        employeeUsageInfos.reduce(
          (acc: any, curr) => {
            acc[`${curr.periodOfDay}`] = [
              ...acc[`${curr.periodOfDay}`],
              {
                dayOfWeek: curr.dayOfWeek,
                busLineId: curr.busLineId,
                busStopLineMappingId: curr.busLineStopMappingId,
                busStopId: curr.busStopId,
                areaId: curr.areaId,
              },
            ]
            return acc
          },
          {
            morning: [],
            evening: [],
          }
        )
      if (employeeUsageInfo) {
        data.data.bookingBusUser.employeeUsageInfo = employeeUsageInfo
      }
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
export const getMeRouteGuard = (token: string) => {
  const axios = useAxios()

  return useQuery(
    ["me_routeGuard", token],
    async () => {
      const { data } = await axios.get(`/account/me`)
      const employeeUsageInfos: EmployeeUsageInfoDataTypes[] =
        data?.data?.bookingBusUser?.employeeUsageInfos

      const employeeUsageInfo: any =
        employeeUsageInfos &&
        employeeUsageInfos.reduce(
          (acc: any, curr) => {
            acc[`${curr.periodOfDay}`] = [
              ...acc[`${curr.periodOfDay}`],
              {
                dayOfWeek: curr.dayOfWeek,
                busLineId: curr.busLineId,
                busStopLineMappingId: curr.busLineStopMappingId,
                areaId: curr.areaId,
              },
            ]
            return acc
          },
          {
            morning: [],
            evening: [],
          }
        )
      if (employeeUsageInfo) {
        data.data.bookingBusUser.employeeUsageInfo = employeeUsageInfo
      }
      return data
    },
    {
      keepPreviousData: true,
      staleTime: 0,
      retry: false,
      refetchOnWindowFocus: false,
      enabled: !!token,
    }
  )
}
