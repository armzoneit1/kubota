/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../providers/http-client"
import { useQuery } from "react-query"
import { UserDataTypes } from "./types"

export const getOne = (userId: string | string[] | undefined) => {
  const axios = useAxios()

  return useQuery(
    ["user", userId],
    async () => {
      const { data } = await axios.get(`/users/${userId}`)

      return data
    },
    {
      keepPreviousData: true,
      staleTime: 0,
      retry: false,
      enabled: !!userId,
      refetchOnWindowFocus: false,
    }
  )
}
