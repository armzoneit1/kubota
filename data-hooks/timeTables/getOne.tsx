/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../providers/http-client"
import { useQuery } from "react-query"
import { TimeTableRoundTypes } from "./types"

export const getOne = (timeTableId: string | string[] | undefined) => {
  const axios = useAxios()

  return useQuery(
    ["timeTable", timeTableId],
    async () => {
      const { data } = await axios.get(`/timeTables/${timeTableId}`)

      const timeTableRounds = data.data.timeTableRounds.map(
        (timeTableRound: TimeTableRoundTypes) => {
          const time = timeTableRound.time
            ? timeTableRound.time.split(":")
            : null
          return {
            ...timeTableRound,
            hours: time ? time[0] : null,
            minute: time ? time[1] : null,
          }
        }
      )

      data.data = { ...data.data, timeTableRounds: timeTableRounds }

      return data
    },
    {
      keepPreviousData: true,
      staleTime: 0,
      retry: false,
      enabled: !!timeTableId,
      refetchOnWindowFocus: false,
    }
  )
}
