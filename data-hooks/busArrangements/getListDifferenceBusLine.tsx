/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../providers/http-client"
import { useQuery } from "react-query"
import { TimeTableRoundDataTypes } from "./types"
import uniq from "lodash/uniq"
import filter from "lodash/filter"
import get from "lodash/get"

export const getListDifferenceBusLine = (
  schedulesId: string | string[] | undefined,
  periodOfDay: "morning" | "evening",
  timeTableRoundId: string | string[] | undefined,
  currentBookingVehicleId: string | string[] | undefined
) => {
  const axios = useAxios()

  return useQuery(
    [
      "differenceBusLine_busArrangement",
      schedulesId,
      periodOfDay,
      timeTableRoundId,
      currentBookingVehicleId,
    ],
    async () => {
      const { data } = await axios.get(
        `/bookingVehicles/differenceBusLine/${schedulesId}/${periodOfDay}/${timeTableRoundId}/${currentBookingVehicleId}`
      )

      return data
    },
    {
      keepPreviousData: true,
      staleTime: 0,
      retry: false,
      enabled:
        !!schedulesId &&
        !!periodOfDay &&
        !!timeTableRoundId &&
        !!currentBookingVehicleId,
      refetchOnWindowFocus: false,
    }
  )
}
