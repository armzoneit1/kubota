/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../../providers/http-client"
import { useQuery } from "react-query"
import {
  SummaryTotalPassengerDataTypes,
  DateDataTypes,
  TimeDataTypes,
  BookingVehicleDataTypes,
  BusLineDataTypes,
} from "./types"
import uniqBy from "lodash/uniqBy"
import get from "lodash/get"
import sortBy from "lodash/sortBy"

export const getList = (
  startDate: string,
  endDate: string,
  typeOfTotalPassenger: string,
  time: string,
  busLineName: string,
  query: boolean,
  setQuery: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const axios = useAxios()

  return useQuery(
    [
      "summaryTotalPassenger",
      startDate,
      endDate,
      typeOfTotalPassenger,
      time,
      busLineName,
      query,
    ],
    async () => {
      const { data } = await axios.get(
        `/reports/summaryTotalPassenger?startDate=${startDate}&endDate=${endDate}&typeOfTotalPassenger=${typeOfTotalPassenger}${
          time ? `&time=${time}` : ""
        }${busLineName ? `&busLineName=${busLineName}` : ""}`
      )

      const dataForDownload = get(data, "data")

      let busLines: { busLineName: string; busLineRank: number }[] = []

      const dates = [...data?.data?.dates].reduce(
        (acc: any[], curr: DateDataTypes, currentIndex: number) => {
          let totalPassenger: number = 0

          const times = curr.times.reduce(
            (previousTime: any[], currentTime) => {
              const bookingVehicles = currentTime.bookingVehicles.reduce(
                (previousValue: any[], currentValue, bookingVehicleIndex) => {
                  let totalPassengerBookingVehicle: number = 0
                  const mappingBusLine = currentValue.busLines.reduce(
                    (previousBusLine: any, currentBusLine) => {
                      busLines.push({
                        busLineName: currentBusLine.busLineName,
                        busLineRank: currentBusLine.busLineRank,
                      })
                      totalPassenger += currentBusLine.totalPassenger
                      totalPassengerBookingVehicle +=
                        currentBusLine.totalPassenger
                      previousBusLine = {
                        ...previousBusLine,
                        [currentBusLine.busLineName]: {
                          ...currentBusLine,
                          vehicleTypeName: currentValue.vehicleTypeName,
                          transportationProviderName:
                            currentValue.transportationProviderName,
                          time: currentTime.time,
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
                    isShowBorderBottom:
                      currentTime.bookingVehicles.length == 0
                        ? false
                        : currentTime.bookingVehicles.length == 1
                        ? true
                        : bookingVehicleIndex ===
                          currentTime.bookingVehicles.length - 1,
                    totalPassengerBookingVehicle: totalPassengerBookingVehicle,
                  })

                  return previousValue
                },
                []
              )

              previousTime.push(...bookingVehicles)

              return previousTime
            },
            []
          )

          acc.push({
            date: curr.date,
            times: [...times],
            totalPassenger: totalPassenger,
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
      enabled: !!startDate && !!endDate && !!typeOfTotalPassenger && query,
      refetchOnWindowFocus: false,
      onSuccess: () => {
        setQuery(false)
      },
    }
  )
}
