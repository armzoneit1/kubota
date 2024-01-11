/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../../providers/http-client"
import { useQuery } from "react-query"
import { SummaryBookingResultDataTypes } from "./types"

export const getList = (
  page: number,
  search: string,
  sort: { id: string; desc: boolean | undefined } | undefined,
  date: string,
  time: string
) => {
  const axios = useAxios()

  return useQuery(
    ["summaryBookingResult", page, search, sort, date, time],
    async () => {
      const { data, headers } = await axios.get(
        `/reports/summaryBookingResult?page=${page}&size=30${
          date ? `&date=${date}` : ""
        }${time ? `&periodOfDay=${time}` : ""}${
          search ? `&search=${search}` : ""
        }${sort ? `&sort=${sort.id},${sort.desc ? "DESC" : "ASC"}` : ""}`
      )

      const pagination = headers["content-range"]
        ? headers["content-range"].split(/\s|-|\//)
        : null
      const currentPage = pagination ? Math.ceil(+pagination[1] / 30) : 1
      const pageCount = pagination ? Math.ceil(+pagination[3] / 30) : 1

      const dataForDownload = data.data
      const filteredData = data.data.reduce(
        (
          acc: SummaryBookingResultDataTypes[],
          curr: SummaryBookingResultDataTypes,
          index: number
        ) => {
          acc.push({
            ...curr,
            busLineRank:
              (currentPage === 1 ? 0 : (currentPage - 1) * 30) + index + 1,
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
        dataForDownload,
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
export const getListDataForDownload = (date: string, time: string) => {
  const axios = useAxios()

  return useQuery(
    ["summaryBookingResult_dataForDownload", date, time],
    async () => {
      const { data } = await axios.get(
        `/reports/summaryBookingResult${date ? `?date=${date}` : ""}${
          time ? `&periodOfDay=${time}` : ""
        }`
      )

      return data
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
