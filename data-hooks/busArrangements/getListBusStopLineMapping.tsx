/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../providers/http-client"
import { useQuery } from "react-query"

export const getListBusStopLineMapping = (
  busLineId: string | string[] | undefined,
  timeTableRoundId: string | string[] | undefined
) => {
  const axios = useAxios()

  return useQuery(
    ["busStopLineMappings_busArrangement", busLineId, timeTableRoundId],
    async () => {
      const { data } = await axios.get(
        `/busLines/${busLineId}/timeTableRounds/${timeTableRoundId}/busStopLineMappings`
      )

      return data
    },
    {
      keepPreviousData: true,
      staleTime: 0,
      retry: false,
      enabled: !!busLineId && !!timeTableRoundId,
      refetchOnWindowFocus: false,
    }
  )
}
