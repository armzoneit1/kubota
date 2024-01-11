/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../../providers/http-client"
import { useQuery } from "react-query"
import { DateDataTypes } from "./types"
import uniqBy from "lodash/uniqBy"
import get from "lodash/get"
import sortBy from "lodash/sortBy"

export const getList = (
  startDate: string,
  endDate: string,
  transportationProviderId: string,
  time: string,
  transportationProviderVehicleTypeMappingId: string,
  vehicleId: string,
  query: boolean,
  setQuery: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const axios = useAxios()

  return useQuery(
    [
      "summaryTotalVehicle",
      startDate,
      endDate,
      time,
      transportationProviderId,
      transportationProviderVehicleTypeMappingId,
      vehicleId,
      query,
    ],
    async () => {
      const { data } = await axios.get(
        `/reports/summaryTotalVehicle?startDate=${startDate}&endDate=${endDate}${
          time ? `&time=${time}` : ""
        }${
          transportationProviderId
            ? `&transportationProviderId=${transportationProviderId}`
            : ""
        }${
          transportationProviderVehicleTypeMappingId
            ? `&transportationProviderVehicleTypeMappingId=${transportationProviderVehicleTypeMappingId}`
            : ""
        }${vehicleId ? `&vehicleId=${vehicleId}` : ""}`
      )
      const dataForDownload = get(data, "data")

      let busLines: { busLineName: string; busLineRank: number }[] = []

      const dates = [...data?.data?.dates].reduce(
        (acc: any[], curr: DateDataTypes, currentIndex: number) => {
          let totalVehicle: number = 0

          const times = curr.times.reduce(
            (previousTime: any[], currentTime) => {
              const bookingVehicleTypes = currentTime.bookingVehicleTypes.reduce(
                (previousValue: any[], currentValue, bookingVehicleIndex) => {
                  let totalVehicleBookingVehicle: number = 0
                  const mappingBusLine = currentValue.busLines.reduce(
                    (previousBusLine: any, currentBusLine) => {
                      busLines.push({
                        busLineName: currentBusLine.busLineName,
                        busLineRank: currentBusLine.busLineRank,
                      })
                      totalVehicle += currentBusLine.totalVehicles
                      totalVehicleBookingVehicle += currentBusLine.totalVehicles
                      let hasLicensePlate = false
                      const licensePlates = currentBusLine.vehicles.map((v) => {
                        hasLicensePlate = !!v.licensePlate
                        return !!v.licensePlate ? v.licensePlate : "-"
                      })

                      previousBusLine = {
                        ...previousBusLine,
                        [currentBusLine.busLineName]: {
                          ...currentBusLine,
                          vehicleTypeName: currentValue.vehicleTypeName,
                          transportationProviderName:
                            currentValue.transportationProviderName,
                          seatCapacity: currentValue.seatCapacity,
                          transportationProviderVehicleTypeMappingId:
                            currentValue.transportationProviderVehicleTypeMappingId,
                          time: currentTime.time,
                          licensePlates: licensePlates.join(", "),
                        },
                      }

                      return previousBusLine
                    },
                    {}
                  )

                  previousValue.push({
                    ...mappingBusLine,
                    time: bookingVehicleIndex === 0 ? currentTime.time : null,
                    vehicleTypeName: currentValue.vehicleTypeName,
                    transportationProviderName:
                      currentValue.transportationProviderName,
                    seatCapacity: currentValue.seatCapacity,
                    transportationProviderVehicleTypeMappingId:
                      currentValue.transportationProviderVehicleTypeMappingId,
                    isShowBorderBottom:
                      currentTime.bookingVehicleTypes.length == 0
                        ? false
                        : currentTime.bookingVehicleTypes.length == 1
                        ? true
                        : bookingVehicleIndex ===
                          currentTime.bookingVehicleTypes.length - 1,
                    totalVehicleBookingVehicle: totalVehicleBookingVehicle,
                  })

                  return previousValue
                },
                []
              )

              previousTime.push(...bookingVehicleTypes)

              return previousTime
            },
            []
          )

          acc.push({
            date: curr.date,
            times: [...times],
            totalVehicle: totalVehicle,
          })

          return acc
        },
        []
      )

      return {
        ...data,
        dates: dates,
        busLines: sortBy(uniqBy(busLines, "busLineRank"), "busLineRank").map(
          (busLine) => busLine.busLineName
        ),
        dataForDownload,
      }
    },
    {
      keepPreviousData: true,
      staleTime: 0,
      retry: false,
      enabled: !!startDate && !!endDate && query,
      refetchOnWindowFocus: false,
      onSuccess: () => {
        setQuery(false)
      },
    }
  )
}
