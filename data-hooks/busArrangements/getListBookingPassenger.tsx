/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../providers/http-client"
import { useQuery } from "react-query"
import { TimeTableRoundDataTypes } from "./types"
import uniq from "lodash/uniq"
import filter from "lodash/filter"
import get from "lodash/get"

export const getListBookingPassenger = (
  schedulesId: string | string[] | undefined,
  periodOfDay: "morning" | "evening",
  timeTableRoundId: string | string[] | undefined
) => {
  const axios = useAxios()

  return useQuery(
    [
      "listBookingPassenger_busArrangement",
      schedulesId,
      periodOfDay,
      timeTableRoundId,
    ],
    async () => {
      const { data } = await axios.get(
        `/busArrangements/bookingPassengers/${schedulesId}/${periodOfDay}/${timeTableRoundId}`
      )

      return data
    },
    {
      keepPreviousData: true,
      staleTime: 0,
      retry: false,
      enabled: !!schedulesId && !!periodOfDay && !!timeTableRoundId,
      refetchOnWindowFocus: false,
    }
  )
}
