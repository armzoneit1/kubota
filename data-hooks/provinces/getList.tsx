/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../providers/http-client"
import { useQuery } from "react-query"
import { ProvinceTypes } from "./types"

export type Option = {
  value: string | number
  label: string
}

export const getList = () => {
  const axios = useAxios()

  return useQuery(
    "provinces",
    async () => {
      const { data } = await axios.get(`/provinces`)

      const filteredData = data.data.reduce(
        (acc: Option[], curr: ProvinceTypes) => {
          acc.push({
            value: curr.name,
            label: curr.name,
          })

          return acc
        },
        []
      )

      return {
        ...data,
        data: filteredData,
      }
    },
    {
      keepPreviousData: true,
      staleTime: 0,
      retry: false,
      refetchOnWindowFocus: false,
    }
  )
}
