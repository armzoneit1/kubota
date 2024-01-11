/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../providers/http-client"
import { useQuery } from "react-query"
import { TimeTableDataTypes, Options } from "./types"

export const getList = (search: string, periodOfDay: "morning" | "evening") => {
  const axios = useAxios()

  return useQuery(
    ["timeTables", search, periodOfDay],
    async () => {
      const { data } = await axios.get(
        `/timeTables?periodOfDay=${periodOfDay}${
          search ? `&search=${search}` : ""
        }`
      )

      const filteredData = data.data.reduce(
        (acc: TimeTableDataTypes[], curr: TimeTableDataTypes) => {
          acc.push({
            ...curr,
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

export const getListTimeTableOptions = (periodOfDay: "morning" | "evening") => {
  const axios = useAxios()

  return useQuery(
    ["timeTableOptions", periodOfDay],
    async () => {
      const { data } = await axios.get(`/timeTables?periodOfDay=${periodOfDay}`)

      const filteredData = data.data.reduce(
        (acc: Options[], curr: TimeTableDataTypes) => {
          acc.push({
            value: curr.id,
            label: curr.name,
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
