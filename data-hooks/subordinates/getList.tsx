/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../providers/http-client"
import { useQuery } from "react-query"
import { SubordinateDataTypes } from "./types"

export const getList = (
  sort: { id: string; desc: boolean | undefined } | undefined
) => {
  const axios = useAxios()

  return useQuery(
    ["subordinates", sort],
    async () => {
      const { data } = await axios.get(
        `/subordinates/me${
          sort ? `?sort=${sort.id},${sort.desc ? "DESC" : "ASC"}` : ""
        }`
      )

      return data
    },
    {
      keepPreviousData: true,
      staleTime: 0,
      retry: false,
      refetchOnWindowFocus: false,
    }
  )
}
