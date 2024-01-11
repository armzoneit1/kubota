/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../providers/http-client"
import { useQuery } from "react-query"

export const getAreaList = () => {
  const axios = useAxios()

  return useQuery(
    "busArrangement_areas",
    async () => {
      const { data } = await axios.get(`/areas/allBusStops`)

      return data
    },

    {
      keepPreviousData: true,
      staleTime: 0,
      retry: false,
      refetchOnWindowFocus: false,
    }
  )
}
