/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../providers/http-client"
import { useQuery } from "react-query"
import { UserDataTypes } from "./types"

export const getList = (
  page: number,
  search: string,
  sort: { id: string; desc: boolean | undefined } | undefined
) => {
  const axios = useAxios()

  return useQuery(
    ["users", page, search, sort],
    async () => {
      const { data, headers } = await axios.get(
        `/users?page=${page}&size=30${
          sort ? `&sort=${sort.id},${sort.desc ? "DESC" : "ASC"}` : ""
        }${search ? `&search=${search}` : ""}`
      )

      const pagination = headers["content-range"]
        ? headers["content-range"].split(/\s|-|\//)
        : null
      const currentPage = pagination ? Math.ceil(+pagination[1] / 30) : 1
      const pageCount = pagination ? Math.ceil(+pagination[3] / 30) : 1

      const filteredData = data.data.reduce(
        (acc: UserDataTypes[], curr: UserDataTypes) => {
          acc.push({
            ...curr,
            name: `${curr.firstName} ${curr.lastName}`,
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
