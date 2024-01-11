/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../providers/http-client"
import { useQuery } from "react-query"

export type Option = {
  value: string
  label: string
}

type ListYears = {
  id: number
  name: string
}

export const getListYears = () => {
  const axios = useAxios()

  return useQuery(
    "listYears",
    async () => {
      const { data } = await axios.get(`/schedules/listOfYear`)

      const filteredData = data.data.reduce(
        (acc: Option[], curr: ListYears) => {
          acc.push({
            value: `${curr.id}`,
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
