/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../../providers/http-client"
import { useQuery } from "react-query"
import { DriverDocumentTypes } from "./types"

export const getOne = (
  providerId: string | string[] | undefined,
  driverId: string | string[] | undefined
) => {
  const axios = useAxios()

  return useQuery(
    ["driver", providerId, driverId],
    async () => {
      const { data } = await axios.get(
        `/transportationProviders/${providerId}/drivers/${driverId}`
      )

      data.data.driverDocuments =
        data.data.driverDocuments && data.data.driverDocuments.length > 0
          ? data.data.driverDocuments.map((d: DriverDocumentTypes) => ({
              ...d,
              name: d?.documentName,
            }))
          : []
      data.data = {
        ...data.data,
        vehicleId: data.data.vehicle
          ? {
              value: data.data.vehicle.vehicleId,
              label: data.data.licencePlate,
            }
          : null,
        typeAndSeatCapacity: data.data.vehicle
          ? `${data.data.vehicle.vehicleTypeName}/${data.data.vehicle.seatCapacity}`
          : null,
      }

      return data
    },
    {
      keepPreviousData: true,
      staleTime: 0,
      retry: false,
      enabled: !!providerId && !!driverId,
      refetchOnWindowFocus: false,
    }
  )
}
