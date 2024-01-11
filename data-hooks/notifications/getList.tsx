/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../providers/http-client"
import { useQuery } from "react-query"
// import { EmployeeDataTypes } from "./types"

export const getList = () => {
  const axios = useAxios()

  return useQuery(
    ["notifications"],
    async () => {
      const { data } = await axios.get(`notifications`)

      return data
    },

    {
      keepPreviousData: true,
      staleTime: 0,
      retry: false,
      refetchOnWindowFocus: false,
      refetchInterval: 60000,
    }
  )
}
