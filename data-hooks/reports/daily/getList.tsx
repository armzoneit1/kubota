/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../../providers/http-client"
import { useQuery } from "react-query"
import get from "lodash/get"
import { BusLineDataTypes } from "./types"
import orderBy from "lodash/orderBy"

export const getList = (
  date: string,
  time: string,
  request: boolean,
  setRequest: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const axios = useAxios()
  return useQuery(
    ["daily", date, time, request],
    async () => {
      const { data } = await axios.get(
        `/reports/daily?date=${date}${time ? `&time=${time}` : ""}`
      )

      const dataForDownload = get(data, "data")

      const timeTableRounds = [...data?.data?.timeTableRounds].map(
        (timeTableRound, index) => {
          const busStops = orderBy(
            timeTableRound?.busLines,
            "busLineRank"
          ).reduce((acc: any[], curr: BusLineDataTypes, busLineOrder) => {
            curr.busStops.forEach((busStop, i) => {
              let driver = ["-"]

              curr?.bookingVehicles?.forEach((booking, bookingIndex) => {
                if (booking?.licensePlate != null) {
                  if (bookingIndex === 0) {
                    driver = []
                  }
                  driver.push(
                    `${booking?.licensePlate}(${booking?.driverFirstName} ${booking?.driverMobileNo})`
                  )
                }
              })

              acc.push({
                busLineId: curr.busLineId,
                busLineName: i === 0 ? curr.busLineName : null,
                busLineRank: curr.busLineRank,
                busStopId: busStop.busStopId,
                busStopName: busStop.busStopName,
                rank: busStop.rank,
                totalPassenger: busStop.totalPassenger,
                driver: i === 0 ? driver : null,
                order: i === 0 ? busLineOrder + 1 : null,
              })
            })
            return acc
          }, [])
          return {
            timeTableRoundId: timeTableRound.timeTableRoundId,
            time: timeTableRound.time,
            periodOfDay: timeTableRound.periodOfDay,
            busStops: busStops,
          }
        }
      )

      return { ...data, dataForDownload, timeTableRounds }
    },
    {
      keepPreviousData: true,
      staleTime: 0,
      retry: false,
      enabled: !!date && request,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        setRequest(false)
      },
    }
  )
}
