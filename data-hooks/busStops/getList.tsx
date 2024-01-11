/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../providers/http-client"
import { useQuery } from "react-query"
import { BusStopDataTypes } from "./types"

export const getList = (periodOfDay: "morning" | "evening") => {
  const axios = useAxios()

  return useQuery(
    ["busStops", periodOfDay],
    async () => {
      const { data } = await axios.get(`/busStops?periodOfDay=${periodOfDay}`)

      const filteredData = data.data.reduce(
        (acc: BusStopDataTypes[], curr: BusStopDataTypes) => {
          acc.push({
            ...curr,
            keyArea: curr.areaName,
          })

          return acc
        },
        []
      )

      return {
        ...data,
        data: filteredData,
      }
    },
    {
      keepPreviousData: true,
      staleTime: 0,
      retry: false,
      enabled: !!periodOfDay,
      refetchOnWindowFocus: false,
    }
  )
}
