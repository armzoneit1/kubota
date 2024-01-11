/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../../providers/http-client"
import { useQuery } from "react-query"
import { CompareBusStopDataTypes } from "./types"

export const getList = (
  page: number,
  sort: { id: string; desc: boolean | undefined } | undefined,
  startDate: string,
  endDate: string,
  time: string,
  display: string
) => {
  const axios = useAxios()

  return useQuery(
    ["compareBusStop", page, sort, startDate, endDate, time, display],
    async () => {
      const { data, headers } = await axios.get(
        `/reports/compareBusStop?page=${page}&size=30${
          startDate ? `&startDate=${startDate}` : ""
        }${endDate ? `&endDate=${endDate}` : ""}${time ? `&time=${time}` : ""}${
          display ? `&display=${display}` : ""
        }${sort ? `&sort=${sort.id},${sort.desc ? "DESC" : "ASC"}` : ""}`
      )

      const pagination = headers["content-range"]
        ? headers["content-range"].split(/\s|-|\//)
        : null
      const currentPage = pagination ? Math.ceil(+pagination[1] / 30) : 1
      const pageCount = pagination ? Math.ceil(+pagination[3] / 30) : 1

      const filteredData = [...data.data].reduce(
        (acc: CompareBusStopDataTypes[], curr: CompareBusStopDataTypes) => {
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
      enabled: !!startDate && !!endDate,
      refetchOnWindowFocus: false,
    }
  )
}
export const getListDataForDownload = (
  startDate: string,
  endDate: string,
  time: string,
  display: string
) => {
  const axios = useAxios()

  return useQuery(
    ["compareBusStop_dataForDownload", startDate, endDate, time, display],
    async () => {
      const { data } = await axios.get(
        `/reports/compareBusStop${startDate ? `?startDate=${startDate}` : ""}${
          endDate ? `&endDate=${endDate}` : ""
        }${time ? `&time=${time}` : ""}${display ? `&display=${display}` : ""}`
      )

      return data
    },
    {
      keepPreviousData: true,
      staleTime: 0,
      retry: false,
      enabled: !!startDate && !!endDate,
      refetchOnWindowFocus: false,
    }
  )
}
