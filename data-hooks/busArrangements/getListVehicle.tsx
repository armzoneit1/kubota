/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../providers/http-client"
import { useQueries } from "react-query"

export const getListVehicle = (
  transportationProviderVehicleTypeMappingIds: number[]
) => {
  const axios = useAxios()

  const queries = transportationProviderVehicleTypeMappingIds.map(
    (transportationProviderVehicleTypeMappingId) => ({
      queryKey: [
        `listVehicle_${transportationProviderVehicleTypeMappingId}_busArrangement`,
        transportationProviderVehicleTypeMappingId,
      ],
      queryFn: async () => {
        const { data } = await axios.get(
          `vehicles/${transportationProviderVehicleTypeMappingId}`
        )

        return data
      },
      keepPreviousData: true,
      staleTime: 0,
      retry: false,
      enabled: !!transportationProviderVehicleTypeMappingId,
      refetchOnWindowFocus: false,
    })
  )

  return useQueries(queries)
}
