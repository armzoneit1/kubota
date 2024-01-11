/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../providers/http-client"
import { useQuery } from "react-query"
import { BusLineDataTypes } from "./types"
import sortBy from "lodash/sortBy"

export const getList = (
  page: number,
  search: string,
  periodOfDay: "morning" | "evening"
) => {
  const axios = useAxios()

  return useQuery(
    ["busLines", page, search, periodOfDay],
    async () => {
      const { data, headers } = await axios.get(
        `/busLines?periodOfDay=${periodOfDay}&page=${page}&size=30${
          search ? `&search=${search}` : ""
        }`
      )

      const pagination = headers["content-range"]
        ? headers["content-range"].split(/\s|-|\//)
        : null
      const currentPage = pagination ? Math.ceil(+pagination[1] / 30) : 1
      const pageCount = pagination ? Math.ceil(+pagination[3] / 30) : 1

      const filteredData = data.data.reduce(
        (acc: BusLineDataTypes[], curr: BusLineDataTypes) => {
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
        pageCount,
        page: currentPage,
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

export type Option = {
  value: string | number
  label: string
}

export type GroupChoice = {
  value?: string | number
  label: string
  options?: Option[]
}

export const getListBusLineOptions = () => {
  const axios = useAxios()

  return useQuery(
    "busLineOptions",
    async () => {
      const { data } = await axios.get(`/areas/allBusStops`)

      const filteredData = data.data.reduce(
        (acc: GroupChoice[], curr: BusLineDataTypes) => {
          const options: Option[] = sortBy(curr.busStops, ["rank"]).map(
            (busStop) => ({
              value: busStop.busStopId,
              label: busStop.busStopName ? busStop.busStopName : "",
            })
          )

          acc.push({
            label: curr.name,
            options: options,
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

      refetchOnWindowFocus: false,
    }
  )
}

export const getAll = (periodOfDay: "morning" | "evening") => {
  const axios = useAxios()

  return useQuery(
    ["busLines", periodOfDay],
    async () => {
      const { data } = await axios.get(
        `/busLines?periodOfDay=${periodOfDay}&page=1&size=1000`
      )

      const filteredData = data.data.reduce(
        (acc: BusLineDataTypes[], curr: BusLineDataTypes) => {
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
