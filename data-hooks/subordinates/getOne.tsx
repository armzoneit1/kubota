/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../providers/http-client"
import { useQuery } from "react-query"
import { EmployeeUsageInfoDataTypes } from "./types"

export const getOne = (employeeNo: string | string[] | undefined) => {
  const axios = useAxios()

  return useQuery(
    ["subordinate_employee", employeeNo],
    async () => {
      const { data } = await axios.get(`/subordinates/me/${employeeNo}`)

      const employeeUsageInfos: EmployeeUsageInfoDataTypes[] =
        data?.data?.registerBookingBusInfo?.employeeUsageInfos

      const employeeUsageInfo: any = employeeUsageInfos
        ? employeeUsageInfos.reduce(
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
        : undefined

      if (employeeUsageInfo) {
        data.data.registerBookingBusInfo.employeeUsageInfo = employeeUsageInfo
      }

      if (data?.data?.registerBookingBusInfo?.supervisorEmployeeNo) {
        data.data.registerBookingBusInfo.supervisorTitle =
          data.data.supervisorTitle
        data.data.registerBookingBusInfo.supervisorFirstName =
          data.data.supervisorFirstName
        data.data.registerBookingBusInfo.supervisorLastName =
          data.data.supervisorLastName
      }
      if (
        data?.data?.registerBookingBusInfo?.supervisorEmployeeNoFromApproval
      ) {
        data.data.registerBookingBusInfo.supervisorTitleFromApproval =
          data.data.supervisorTitleFromApproval
        data.data.registerBookingBusInfo.supervisorFirstNameFromApproval =
          data.data.supervisorFirstNameFromApproval
        data.data.registerBookingBusInfo.supervisorLastNameFromApproval =
          data.data.supervisorLastNameFromApproval
      }

      if (
        data?.data?.subordinateChannel &&
        data?.data?.registerBookingBusInfo
      ) {
        data.data.registerBookingBusInfo.subordinateChannel =
          data?.data?.subordinateChannel
      }

      return data
    },
    {
      keepPreviousData: true,
      staleTime: 0,
      retry: false,
      enabled: !!employeeNo,
      refetchOnWindowFocus: false,
    }
  )
}
