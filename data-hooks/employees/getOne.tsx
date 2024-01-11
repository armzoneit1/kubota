/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../providers/http-client"
import { useQuery } from "react-query"
import filter from "lodash/filter"

const dayOfWeeks = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
]

export const getOne = (employeeId: string | string[] | undefined) => {
  const axios = useAxios()

  return useQuery(
    ["employee", employeeId],
    async () => {
      const { data } = await axios.get(`/employees/${employeeId}`)
      const employeeUsageInfos: any[] = []
      const employeeUsageInfoMorning = filter(data?.data?.employeeUsageInfos, {
        periodOfDay: "morning",
      })

      dayOfWeeks.forEach((day) => {
        const filteredEmployeeUsageInfo = filter(employeeUsageInfoMorning, {
          dayOfWeek: day,
        })
        if (filteredEmployeeUsageInfo?.length > 0) {
          employeeUsageInfos.push(filteredEmployeeUsageInfo[0])
        } else {
          employeeUsageInfos.push({
            id: null,
            plantId: null,
            employeeNo: null,
            dayOfWeek: day,
            periodOfDay: "morning",
            busLineStopMappingId: null,
            areaId: null,
            busStopId: null,
            busStopName: null,
            busLineId: null,
            busLineName: null,
            createdAt: null,
            updatedAt: null,
            deletedAt: null,
          })
        }
      })

      const employeeUsageInfoEvening = filter(data?.data?.employeeUsageInfos, {
        periodOfDay: "evening",
      })

      dayOfWeeks.forEach((day) => {
        const filteredEmployeeUsageInfo = filter(employeeUsageInfoEvening, {
          dayOfWeek: day,
        })
        if (filteredEmployeeUsageInfo?.length > 0) {
          employeeUsageInfos.push(filteredEmployeeUsageInfo[0])
        } else {
          employeeUsageInfos.push({
            id: null,
            plantId: null,
            employeeNo: null,
            dayOfWeek: day,
            periodOfDay: "evening",
            busLineStopMappingId: null,
            areaId: null,
            busStopId: null,
            busStopName: null,
            busLineId: null,
            busLineName: null,
            createdAt: null,
            updatedAt: null,
            deletedAt: null,
          })
        }
      })

      data.data.employeeUsageInfos = employeeUsageInfos

      return data
    },
    {
      keepPreviousData: true,
      staleTime: 0,
      retry: false,
      enabled: !!employeeId,
      refetchOnWindowFocus: false,
    }
  )
}
