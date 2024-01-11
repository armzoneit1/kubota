/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../../providers/http-client"
import { useQuery } from "react-query"

export type Option = {
  value: string
  label: string
}

export const getListTime = () => {
  const axios = useAxios()

  return useQuery(
    "compareBusStopListTime",
    async () => {
      const { data } = await axios.get(`/reports/compareBusStop/listOfTime`)

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
