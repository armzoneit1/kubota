/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../providers/http-client"
import { useQueries } from "react-query"

export const getListDriver = (transportationProviderIds: number[]) => {
  const axios = useAxios()
  const queries = transportationProviderIds.map((transportationProviderId) => ({
    queryKey: [
      `listDriver_${transportationProviderId}_busArrangement`,
      transportationProviderId,
    ],
    queryFn: async () => {
      const { data } = await axios.get(`drivers/${transportationProviderId}`)

      return data
    },
    keepPreviousData: true,
    staleTime: 0,
    retry: false,
    enabled: !!transportationProviderId,
    refetchOnWindowFocus: false,
  }))

  return useQueries(queries)
}
