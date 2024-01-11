/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../providers/http-client"
import { useQuery } from "react-query"
import { TimeTableRoundDataTypes } from "./types"
import uniq from "lodash/uniq"
import filter from "lodash/filter"
import get from "lodash/get"

export const getListVehicleType = () => {
  const axios = useAxios()

  return useQuery(
    "listVehicleType_busArrangement",
    async () => {
      const { data } = await axios.get(
        `/transportationProviderVehicleTypeMappings`
      )

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
