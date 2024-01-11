/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../providers/http-client"
import { useQuery } from "react-query"

export const getOneCustomDetail = (
  timeTableId: string | string[] | undefined
) => {
  const axios = useAxios()

  return useQuery(
    ["timeTableCustomDetail", timeTableId],
    async () => {
      const { data } = await axios.get(
        `/timeTables/${timeTableId}/customDetails`
      )

      return data
    },
    {
      keepPreviousData: true,
      staleTime: 0,
      retry: false,
      enabled: !!timeTableId,
      refetchOnWindowFocus: false,
    }
  )
}
