/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../providers/http-client"
import { useQuery } from "react-query"
import { ScheduleDataTypes } from "./types"

const conditionShowCheckbox = (date: string) => new Date(date) > new Date()

export const getList = (
  day: "all" | "saturdayWorkday" | "publicHoliday" | "other",
  page: number,
  search: string,
  sort: { id: string; desc: boolean | undefined } | undefined,
  year: string,
  month: string
) => {
  const axios = useAxios()

  return useQuery(
    ["schedules", day, search, sort, page, year, month],
    async () => {
      const { data, headers } = await axios.get(
        `/schedules${day === "all" ? "" : `/${day}`}${
          month ? "" : `?page=${page}&size=30`
        }${year ? (month ? `?year=${year}` : `&year=${year}`) : ""}${
          month ? `&month=${month}` : ""
        }${sort ? `&sort=${sort.id},${sort.desc ? "DESC" : "ASC"}` : ""}${
          search ? `&search=${search}` : ""
        }`
      )

      const pagination = headers["content-range"]
        ? headers["content-range"].split(/\s|-|\//)
        : null
      const currentPage = pagination ? Math.ceil(+pagination[1] / 30) : 1
      const pageCount = pagination ? Math.ceil(+pagination[3] / 30) : 1

      let shows: boolean[] = []

      const filteredData = data.data.reduce(
        (acc: ScheduleDataTypes[], curr: ScheduleDataTypes) => {
          acc.push({
            ...curr,
            isShowCheckbox:
              day === "all" ? false : conditionShowCheckbox(curr.date),
          })

          shows.push(day === "all" ? false : conditionShowCheckbox(curr.date))

          return acc
        },
        []
      )

      const hasCheckbox =
        day === "all" ? false : shows.filter((s) => s).length > 0

      return {
        ...data,
        data: filteredData,
        pageCount: month ? 1 : pageCount,
        page: month ? 1 : currentPage,
        hasCheckbox: hasCheckbox,
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
