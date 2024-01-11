/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../providers/http-client"
import { useQuery } from "react-query"
import { BookingDataTypes, STATUS } from "./types"
import hasIn from "lodash/hasIn"
import get from "lodash/get"

export const getList = (
  page: number,
  search: string,
  sort: { id: string; desc: boolean | undefined } | undefined,
  date: string,
  time: string
) => {
  const axios = useAxios()

  return useQuery(
    ["bookings", page, search, sort, date, time],
    async () => {
      const { data, headers } = await axios.get(
        `/bookings?page=${page}&size=30${date ? `&date=${date}` : ""}${
          time ? `&time=${time}` : ""
        }${search ? `&search=${search}` : ""}${
          sort ? `&sort=${sort.id},${sort.desc ? "DESC" : "ASC"}` : ""
        }`
      )

      const pagination = headers["content-range"]
        ? headers["content-range"].split(/\s|-|\//)
        : null
      const currentPage = pagination ? Math.ceil(+pagination[1] / 30) : 1
      const pageCount = pagination ? Math.ceil(+pagination[3] / 30) : 1

      const filteredData = data.data.reduce(
        (acc: BookingDataTypes[], curr: BookingDataTypes) => {
          acc.push({
            ...curr,
            status: hasIn(STATUS, `${curr.status}`)
              ? get(STATUS, `${curr.status}`)
              : curr.status,
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
      refetchOnWindowFocus: false,
    }
  )
}
