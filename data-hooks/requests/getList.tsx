/* eslint-disable react-hooks/rules-of-hooks */

import { useAxios } from "../../providers/http-client"
import { useQuery } from "react-query"

export const getListRequest = (
  page: number,
  sort: { id: string; desc: boolean | undefined } | undefined,
  startDate: string,
  endDate: string,
  periodOfDay: string,
  time: string,
  passenger: string,
  bookingStatus: string,
  busLine: string,
  busStop: string
) => {
  const axios = useAxios()

  return useQuery(
    [
      "listOfRequest",
      page,
      sort,
      startDate,
      endDate,
      periodOfDay,
      time,
      passenger,
      bookingStatus,
      busLine,
      busStop,
    ],
    async () => {
      const { data, headers } = await axios.get(
        `requests/me?page=${page}&size=30&startDate=${startDate}&endDate=${endDate}${
          periodOfDay ? `&periodOfDay=${periodOfDay}` : ""
        }${time ? `&time=${time}` : ""}${
          passenger ? `&passenger=${passenger}` : ""
        }${bookingStatus ? `&bookingStatus=${bookingStatus}` : ""}${
          busLine ? `&busLine=${busLine}` : ""
        }${busStop ? `&busStop=${busStop}` : ""}${
          sort ? `&sort=${sort.id},${sort.desc ? "DESC" : "ASC"}` : ""
        }`
      )

      const pagination = headers["content-range"]
        ? headers["content-range"].split(/\s|-|\//)
        : null
      const currentPage = pagination ? Math.ceil(+pagination[1] / 30) : 1
      const pageCount = pagination ? Math.ceil(+pagination[3] / 30) : 1

      return { ...data, pageCount, page: currentPage }
    },
    {
      keepPreviousData: true,
      staleTime: 0,
      retry: false,
      refetchOnWindowFocus: false,
      enabled: !!startDate && !!endDate,
    }
  )
}
