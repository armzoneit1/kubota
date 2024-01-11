/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../providers/http-client"
import { useQuery } from "react-query"
import { PlanningDataTypes } from "./types"

export const getList = (
  page: number,
  search: string,
  sort: { id: string; desc: boolean | undefined } | undefined,
  year: string,
  month: string
) => {
  const axios = useAxios()

  return useQuery(
    ["plannings", search, sort, page, year, month],
    async () => {
      const { data, headers } = await axios.get(
        `/plannings${month ? "" : `?page=${page}&size=30`}${
          year ? (month ? `?year=${year}` : `&year=${year}`) : ""
        }${month ? `&month=${month}` : ""}${
          sort ? `&sort=${sort.id},${sort.desc ? "DESC" : "ASC"}` : ""
        }${search ? `&search=${search}` : ""}`
      )

      const pagination = headers["content-range"]
        ? headers["content-range"].split(/\s|-|\//)
        : null
      const currentPage = pagination ? Math.ceil(+pagination[1] / 30) : 1
      const pageCount = pagination ? Math.ceil(+pagination[3] / 30) : 1

      const filteredData = data.data.reduce(
        (acc: PlanningDataTypes[], curr: PlanningDataTypes) => {
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
        pageCount: month ? 1 : pageCount,
        page: month ? 1 : currentPage,
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
