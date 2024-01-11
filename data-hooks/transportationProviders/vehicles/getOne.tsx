/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../../providers/http-client"
import { useQuery } from "react-query"

export const getOne = (
  providerId: string | string[] | undefined,
  vehicleId: string | string[] | undefined
) => {
  const axios = useAxios()

  return useQuery(
    ["vehicles", providerId, vehicleId],
    async () => {
      const { data } = await axios.get(
        `/transportationProviders/${providerId}/vehicles/${vehicleId}`
      )

      data.data = {
        ...data.data,
        vehicleType: {
          value: data.data.transportationProviderVehicleTypeMappingId,
          label: data.data.vehicleTypeName,
          seatCapacity: data.data.seatCapacity,
        },
        driver: data.data.driverId
          ? {
              value: data.data.driverId,
              label: `${data.data.driverFirstName} ${data.data.driverLastName}`,
            }
          : null,
      }

      return data
    },
    {
      keepPreviousData: true,
      staleTime: 0,
      retry: false,
      enabled: !!providerId && !!vehicleId,
      refetchOnWindowFocus: false,
    }
  )
}
