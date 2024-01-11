/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../providers/http-client"
import { useQuery } from "react-query"
import { BusStopTypes } from "./types"

export const getOne = (areaId: string | string[] | undefined) => {
  const axios = useAxios()

  return useQuery(
    ["area", areaId],
    async () => {
      const { data } = await axios.get(`/areas/${areaId}`)

      data.data.status = data.data.status ? "active" : "inactive"

      data.data.busStops = data.data.busStops.map(
        (busStop: BusStopTypes<string>) => ({
          ...busStop,
          status: busStop.status ? "active" : "inactive",
        })
      )

      return data
    },
    {
      keepPreviousData: true,
      staleTime: 0,
      retry: false,
      enabled: !!areaId,
      refetchOnWindowFocus: false,
    }
  )
}
