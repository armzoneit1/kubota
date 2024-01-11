/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../providers/http-client"
import { useQuery } from "react-query"
import { BusStopTypes } from "./types"

export const getOne = (busLineId: string | string[] | undefined) => {
  const axios = useAxios()

  return useQuery(
    ["busLine", busLineId],
    async () => {
      const { data } = await axios.get(`/busLines/${busLineId}`)

      const busStops = data.data.busStops.map((bus: BusStopTypes) => ({
        ...bus,
        busStop: { value: bus.busStopId, label: bus.name },
      }))
      data.data.busStops = busStops
      data.data.status = data.data.status ? "active" : "inactive"

      return data
    },
    {
      keepPreviousData: true,
      staleTime: 0,
      retry: false,
      enabled: !!busLineId,
      refetchOnWindowFocus: false,
    }
  )
}
