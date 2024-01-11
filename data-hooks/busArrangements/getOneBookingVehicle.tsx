/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../providers/http-client"
import { useQuery } from "react-query"
import { TimeTableRoundDataTypes } from "./types"
import uniqBy from "lodash/uniqBy"
import get from "lodash/get"
import uniq from "lodash/uniq"

export const getOneBookingVehicle = (
  scheduleId: string | string[] | undefined,
  periodOfDay: "morning" | "evening",
  bookingVehicleId: string | string[] | undefined
) => {
  const axios = useAxios()

  return useQuery(
    [
      "busArrangements_bookingVehicle",
      scheduleId,
      periodOfDay,
      bookingVehicleId,
    ],
    async () => {
      const { data } = await axios.get(
        `/busArrangements/${scheduleId}/${periodOfDay}/${bookingVehicleId}`
      )

      const isConfirm: string[] = []

      let totalBookingPassengerIsNormalBusStopBySetting = 0
      let totalBookingPassengerIsNotNormalBusStopBySetting = 0

      const busStops =
        data?.data?.arrangements &&
        get(data, "data.arrangements.timeTableRounds").reduce(
          (acc: any[], curr: TimeTableRoundDataTypes, currentIndex: number) => {
            curr.busLines.map((busLine, busLineIndex) => {
              busLine.arrangedVehicles.map((vehicle, vehicleIndex) => {
                const mappingBusStops: {
                  busStopId: number
                  busStopName: string
                  isNormalBusStopBySetting: boolean
                  passengers: any[]
                }[] = [...vehicle.passengers].map((passenger) => ({
                  busStopId: passenger.busStopLineMapping.busStopId,
                  busStopName: passenger.busStopLineMapping.busStopName,
                  isNormalBusStopBySetting: busLine.defaultSettingBusStopIds.includes(
                    passenger.busStopLineMapping.busStopId
                  ),
                  passengers: [],
                }))

                const busStops = uniqBy(mappingBusStops, "busStopId")

                vehicle.passengers.map((passenger, passengerIndex) => {
                  busStops.map((busStop) => {
                    isConfirm.push(passenger.bookingStatus)

                    if (
                      busStop.isNormalBusStopBySetting &&
                      busStop.busStopId ===
                        passenger.busStopLineMapping.busStopId
                    )
                      totalBookingPassengerIsNormalBusStopBySetting++
                    else if (
                      !busStop.isNormalBusStopBySetting &&
                      busStop.busStopId ===
                        passenger.busStopLineMapping.busStopId
                    )
                      totalBookingPassengerIsNotNormalBusStopBySetting++
                    if (
                      busStop.busStopId ===
                      passenger.busStopLineMapping.busStopId
                    ) {
                      return busStop.passengers.push({
                        timeTableRoundId: curr.timeTableRoundId,
                        time: curr.time,
                        busLineId: busLine.id,
                        busLineName: busLine.name,
                        ...passenger,
                      })
                    }
                    return busStop
                  })
                })
                acc = [...acc, ...busStops]
              })
            })

            return acc
          },
          []
        )
      data.data.busStops = busStops

      return {
        ...data,
        totalBookingPassengerIsNormalBusStopBySetting,
        totalBookingPassengerIsNotNormalBusStopBySetting,
        bookingStatus: uniq(isConfirm)[0],
      }
    },
    {
      keepPreviousData: true,
      staleTime: 0,
      retry: false,
      enabled: !!scheduleId && !!periodOfDay && !!bookingVehicleId,
      refetchOnWindowFocus: false,
    }
  )
}
