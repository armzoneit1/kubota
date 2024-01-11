/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../providers/http-client"
import { useQuery } from "react-query"
import { TimeTableRoundDataTypes } from "./types"
import uniq from "lodash/uniq"
import filter from "lodash/filter"
import get from "lodash/get"

export const getOneMoreInformation = (
  scheduleId: string | string[] | undefined,
  periodOfDay: "morning" | "evening"
) => {
  const axios = useAxios()

  return useQuery(
    ["busArrangement_information", scheduleId, periodOfDay],
    async () => {
      const { data } = await axios.get(
        `/busArrangements/${scheduleId}/${periodOfDay}`
      )

      const transportationProviderVehicleTypeMappingIds: number[] = []
      const transportationProviderId: number[] = []

      const timeTableRounds =
        data?.data?.arrangements &&
        get(data, "data.arrangements.timeTableRounds").reduce(
          (acc: any[], curr: TimeTableRoundDataTypes) => {
            const busLines = curr.busLines.reduce(
              (busLineAcc: any[], busLineCurr) => {
                const arrangedVehicles = busLineCurr.arrangedVehicles.map(
                  (arrangedVehicle, arrangedVehicleIndex) => {
                    let hide = false
                    if (arrangedVehicleIndex > 0) {
                      const before: any =
                        busLineCurr.arrangedVehicles[arrangedVehicleIndex - 1]
                      if (before?.keyBusLine === arrangedVehicle?.keyBusLine)
                        hide = true
                      else hide = false
                    }
                    transportationProviderVehicleTypeMappingIds.push(
                      arrangedVehicle.transportationProviderVehicleTypeMappingId
                    )
                    transportationProviderId.push(
                      arrangedVehicle.transportationProviderId
                    )
                    return {
                      ...arrangedVehicle,
                      busLineId: busLineCurr.id,
                      busLineName: busLineCurr.name,
                      hide,
                      keyBusLine: busLineCurr.name,
                      vehicleTypeNameMapping: `${arrangedVehicle.vehicleTypeName} (${arrangedVehicle.totalBookingPassenger}/${arrangedVehicle.seatCapacity})`,
                      vehicleIdMapping: arrangedVehicle.vehicleId
                        ? {
                            value: arrangedVehicle.vehicleId,
                            label: arrangedVehicle.licensePlate,
                            transportationProviderVehicleTypeMappingId:
                              arrangedVehicle.transportationProviderVehicleTypeMappingId,
                            driverId: arrangedVehicle.driverId,
                            transportationProviderId:
                              arrangedVehicle.transportationProviderId,
                          }
                        : null,
                      driverIdMapping: arrangedVehicle.driverId
                        ? {
                            value: arrangedVehicle.driverId,
                            label: `${arrangedVehicle.firstName} ${arrangedVehicle.lastName}`,
                          }
                        : null,
                      timeTableRoundId: curr.timeTableRoundId,
                    }
                  }
                )

                busLineAcc.push(...arrangedVehicles)
                return busLineAcc
              },
              []
            )
            acc.push({
              time: curr.time,
              timeTableRoundId: curr.timeTableRoundId,
              busLines,
              date: data?.data?.date,
            })
            return acc
          },
          []
        )

      return {
        ...data,
        timeTableRounds,
        transportationProviderVehicleTypeMappingIds: uniq(
          transportationProviderVehicleTypeMappingIds
        ),
        transportationProviderId: uniq(transportationProviderId),
      }
    },
    {
      keepPreviousData: true,
      staleTime: 0,
      retry: false,
      enabled: !!scheduleId && !!periodOfDay,
      refetchOnWindowFocus: false,
    }
  )
}
