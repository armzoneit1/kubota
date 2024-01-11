/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../../providers/http-client"
import { useQuery } from "react-query"
import { BusStopDetailTypes } from "./types"
import get from "lodash/get"

export const getOne = (bookingVehicleId: string | string[] | undefined) => {
  const axios = useAxios()

  return useQuery(
    ["summaryBookingDetail", bookingVehicleId],
    async () => {
      const { data } = await axios.get(
        `/reports/summaryBookingResult/${bookingVehicleId}`
      )
      const dataForDownload = get(data, "data")
      const filteredBusStops =
        get(data, "data.busStops") &&
        get(data, "data.busStops").reduce(
          (acc: any[], curr: BusStopDetailTypes, busStopIndex: number) => {
            curr.passengers.map((p, index) => {
              acc.push({
                rank: index === 0 ? busStopIndex + 1 : null,
                busStopRank: index === 0 ? curr?.busStopRank : null,
                busStopName: index === 0 ? curr?.busStopName : null,
                passengers: {
                  employeeNo: p.employeeNo,
                  title: p.title,
                  firstName: p.firstName,
                  lastName: p.lastName,
                },
                isNormalBusStopBySetting: curr.isNormalBusStopBySetting,
              })
            })
            return acc
          },
          []
        )

      const busStops =
        filteredBusStops &&
        filteredBusStops.map((busStop: any, index: number) => {
          if (
            index !== 0 &&
            index % 30 === 0 &&
            !busStop?.busStopRank &&
            !busStop?.busStopName
          ) {
            return {
              ...busStop,
              busStopRank: data.data.busStops[index - 1]?.busStopRank,
              busStopName: data.data.busStops[index - 1]?.busStopName,
            }
          } else return { ...busStop }
        })

      return {
        ...data,
        dataForDownload,
        busStops,
      }
    },
    {
      keepPreviousData: true,
      staleTime: 0,
      retry: false,
      enabled: !!bookingVehicleId,
      refetchOnWindowFocus: false,
    }
  )
}
