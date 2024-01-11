/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../providers/http-client"
import { useQuery } from "react-query"
import { DayTypes, weekDay } from "./types"
import { DateTime } from "luxon"

export const getOne = (schedulesId: string | string[] | undefined) => {
  const axios = useAxios()

  return useQuery(
    ["schedule", schedulesId],
    async () => {
      const { data } = await axios.get(`/schedules/${schedulesId}`)

      const dayType:
        | "workday"
        | "saturdayWorkday"
        | "publicHoliday"
        | "other"
        | "weekend" = data.data.dayType

      data.data.dayTypeId = {
        value: dayType,
        label: DayTypes[dayType],
      }

      data.data.timeTableMorning.timeTableId = {
        value: data.data.timeTableMorning.timeTableId,
        label: data.data.timeTableMorning.name,
      }
      data.data.timeTableEvening.timeTableId = {
        value: data.data.timeTableEvening.timeTableId,
        label: data.data.timeTableEvening.name,
      }

      return data
    },
    {
      keepPreviousData: true,
      staleTime: 0,
      retry: false,
      enabled: !!schedulesId,
      refetchOnWindowFocus: false,
    }
  )
}
