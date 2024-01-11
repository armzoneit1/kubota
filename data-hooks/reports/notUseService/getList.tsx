/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../../providers/http-client"
import { useQuery } from "react-query"
import { NotUserServiceDataTypes } from "./types"

export const getList = (
  page: number,
  sort: { id: string; desc: boolean | undefined } | undefined,
  startDate: string,
  endDate: string
) => {
  const axios = useAxios()

  return useQuery(
    ["notUseService", page, sort, startDate, endDate],
    async () => {
      const { data, headers } = await axios.get(
        `/reports/notUseService?page=${page}&size=30${
          startDate ? `&startDate=${startDate}` : ""
        }${endDate ? `&endDate=${endDate}` : ""}${
          sort ? `&sort=${sort.id},${sort.desc ? "DESC" : "ASC"}` : ""
        }`
      )

      const pagination = headers["content-range"]
        ? headers["content-range"].split(/\s|-|\//)
        : null
      const currentPage = pagination ? Math.ceil(+pagination[1] / 30) : 1
      const pageCount = pagination ? Math.ceil(+pagination[3] / 30) : 1

      const filteredData = data.data.reduce(
        (acc: NotUserServiceDataTypes[], curr: NotUserServiceDataTypes) => {
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
      enabled: !!startDate && !!endDate,
      retry: false,
      refetchOnWindowFocus: false,
    }
  )
}

export const getListDataForDownload = (startDate: string, endDate: string) => {
  const axios = useAxios()

  return useQuery(
    ["notUseService_dataForDownload", startDate, endDate],
    async () => {
      const { data, headers } = await axios.get(
        `/reports/notUseService${startDate ? `?startDate=${startDate}` : ""}${
          endDate ? `&endDate=${endDate}` : ""
        }`
      )

      return data
    },
    {
      keepPreviousData: true,
      staleTime: 0,
      enabled: !!startDate && !!endDate,
      retry: false,
      refetchOnWindowFocus: false,
    }
  )
}
