/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../../providers/http-client"
import { useQuery } from "react-query"
import { BusLineSummaryDataTypes, TimeTableRoundDataTypes } from "./types"
import filter from "lodash/filter"
import uniq from "lodash/uniq"
import get from "lodash/get"
import { map } from "lodash"

export const getList = (
  sort: { id: string; desc: boolean | undefined } | undefined,
  date: string,
  time: string
) => {
  const axios = useAxios()

  return useQuery(
    ["employeeAnnouncement", sort, date, time],
    async () => {
      const { data } = await axios.get(
        `/reports/employeeAnnouncement?${date ? `date=${date}` : ""}${
          time ? `&periodOfDay=${time}` : ""
        }${sort ? `&sort=${sort.id},${sort.desc ? "DESC" : "ASC"}` : ""}`
      )
      const dataForDownload = get(data, "data")

      const timeTableRounds = get(data, "data")
        ? uniq(
            [...data.data.busLineSummary].reduce((acc: any[], curr) => {
              curr.timeTableRounds.map((timeTable: TimeTableRoundDataTypes) =>
                acc.push(timeTable.time)
              )
              return acc
            }, [])
          )
        : []

      const mappingBusLineSummary = [...data.data.busLineSummary].reduce(
        (acc: any[], curr: BusLineSummaryDataTypes) => {
          const mapping: any[] = []
          const runningNumber: number[] = []
          curr.timeTableRounds.map((timeTableRound, i) => {
            timeTableRound.vehicles.map((v, index) => {
              runningNumber.push(v.runningNumber)
              mapping.push({
                busLineRank: curr.busLineRank,
                busLineName: index === 0 ? curr.busLineName : null,
                keyBusLine: curr.busLineName,
                time: timeTableRound.time,
                runningNumber: v.runningNumber,
                vehicle: {
                  vehicleTypeName: v.vehicleTypeName,
                  runningNumber: v.runningNumber,
                  totalPassenger: v.totalPassenger,
                  vehicleLabel: v.vehicleLabel,
                  licensePlate: v.licensePlate,
                },
              })
            })
          })

          uniq(runningNumber).map((r, index) => {
            const filteredData = filter(mapping, { runningNumber: r }).map(
              (v) => {
                acc.push({
                  busLineRank: v.busLineRank,
                  busLineName: v.busLineName,
                  keyBusLine: v.keyBusLine,
                  runningNumber: v.runningNumber,
                  [v.time]: { ...v.vehicle },
                })
              }
            )
          })

          return acc
        },
        []
      )

      return {
        ...data,
        timeTableRounds: timeTableRounds,
        dataForDownload,
        busLineSummary: mappingBusLineSummary,
      }
    },
    {
      keepPreviousData: true,
      staleTime: 0,
      retry: false,
      enabled: !!date,
      refetchOnWindowFocus: false,
    }
  )
}
