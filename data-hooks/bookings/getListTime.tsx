/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../providers/http-client"
import { useQuery } from "react-query"
import hasIn from "lodash/hasIn"
import get from "lodash/get"

export type Option = {
  value: string
  label: string
}

type ListTime = {
  id: number
  time: string
}

export const TIME = {
  all: "ทั้งหมด",
  morning: "รอบไป",
  evening: "รอบกลับ",
}

export const getListTime = () => {
  const axios = useAxios()

  return useQuery(
    "listTime",
    async () => {
      const { data } = await axios.get(`/bookings/listOfTime`)

      const filteredData = data.data.reduce((acc: Option[], curr: ListTime) => {
        acc.push({
          value: `${curr.time}`,
          label: hasIn(TIME, `${curr.time}`)
            ? get(TIME, `${curr.time}`)
            : curr.time,
        })

        return acc
      }, [])

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
