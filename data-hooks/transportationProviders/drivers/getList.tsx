/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../../providers/http-client"
import { useQuery } from "react-query"
import { DriverDataTypes } from "./types"

export type Option = {
  value: string | number
  label: string
}

export const getList = (
  providerId: string | string[] | undefined,
  page: number,
  search: string,
  sort: { id: string; desc: boolean | undefined } | undefined
) => {
  const axios = useAxios()

  return useQuery(
    ["driverProviders", page, search, sort, providerId],
    async () => {
      const { data, headers } = await axios.get(
        `/transportationProviders/${providerId}/drivers?page=${page}&size=30${
          sort ? `&sort=${sort.id},${sort.desc ? "DESC" : "ASC"}` : ""
        }${search ? `&search=${search}` : ""}`
      )

      const pagination = headers["content-range"]
        ? headers["content-range"].split(/\s|-|\//)
        : null
      const currentPage = pagination ? Math.ceil(+pagination[1] / 30) : 1
      const pageCount = pagination ? Math.ceil(+pagination[3] / 30) : 1

      const filteredData = data?.data.reduce(
        (acc: DriverDataTypes[], curr: DriverDataTypes) => {
          acc.push({
            ...curr,
            name: `${curr.firstName} ${curr.lastName}`,
          })

          return acc
        },
        []
      )

      return {
        ...data,
        data: filteredData,
        pageCount,
        page: currentPage,
      }
    },
    {
      keepPreviousData: true,
      staleTime: 0,
      retry: false,
      enabled: !!providerId,
      refetchOnWindowFocus: false,
    }
  )
}

export const getDriverOptions = (providerId: string | string[] | undefined) => {
  const axios = useAxios()

  return useQuery(
    ["driverProvidersOptions", providerId],
    async () => {
      const { data, headers } = await axios.get(
        `/transportationProviders/${providerId}/drivers`
      )

      const filteredData = data?.data.reduce(
        (acc: Option[], curr: DriverDataTypes) => {
          acc.push({
            value: curr.id,
            label: `${curr.firstName} ${curr.lastName}`,
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
      enabled: !!providerId,
      refetchOnWindowFocus: false,
    }
  )
}
