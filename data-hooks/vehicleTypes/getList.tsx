/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../providers/http-client"
import { useQuery } from "react-query"
import { VehicleTypes } from "./types"

export type Option = {
  value: string | number
  label: string
}

export const getListVehicleTypesOptions = () => {
  const axios = useAxios()

  return useQuery(
    "vehicleTypeOptions",
    async () => {
      const { data } = await axios.get(`/vehicleTypes`)

      const filteredData = data.data.reduce(
        (acc: Option[], curr: VehicleTypes) => {
          acc.push({
            value: curr.id,
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

export const getListVehicleTypes = (isOpen: boolean) => {
  const axios = useAxios()

  return useQuery(
    ["vehicleTypes", isOpen],
    async () => {
      const { data } = await axios.get(`/vehicleTypes`)

      const filteredData = data.data.reduce(
        (acc: VehicleTypes[], curr: VehicleTypes) => {
          acc.push({
            id: curr.id,
            name: curr.name,
            isUseForArrangement: curr.isUseForArrangement ? "use" : "unused",
            limit: curr.limit,
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
      enabled: isOpen,
    }
  )
}
