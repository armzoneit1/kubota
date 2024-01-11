/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../providers/http-client"
import { useQuery } from "react-query"
import { AreaDataTypes } from "./types"

export const getList = (page: number, search: string) => {
  const axios = useAxios()

  return useQuery(
    ["areas", page, search],
    async () => {
      const { data, headers } = await axios.get(
        `/areas?page=${page}&size=30${search ? `&search=${search}` : ""}`
      )

      const pagination = headers["content-range"]
        ? headers["content-range"].split(/\s|-|\//)
        : null
      const currentPage = pagination ? Math.ceil(+pagination[1] / 30) : 1
      const pageCount = pagination ? Math.ceil(+pagination[3] / 30) : 1

      const filteredData = data.data.reduce(
        (acc: AreaDataTypes[], curr: AreaDataTypes) => {
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
      refetchOnWindowFocus: false,
    }
  )
}
