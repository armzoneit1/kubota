/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../providers/http-client"
import { useQuery } from "react-query"
import { OneRequestIdDataTypes } from "./types"
import get from "lodash/get"
import filter from "lodash/filter"

export const getOneRequest = (requestId: string | string[] | undefined) => {
  const axios = useAxios()

  return useQuery(
    ["requests_request", requestId],
    async () => {
      const { data } = await axios.get(`/requests/me/requestId/${requestId}`)
      let periodOfDay = ""
      const requests = data?.data
      const mappingRequests = requests.reduce(
        (acc: any, curr: OneRequestIdDataTypes) => {
          if (curr.employeeNo === curr.bookedByEmployeeNo) {
            acc.me = [...acc.me, curr]
          } else if (curr.employeeNo !== curr.bookedByEmployeeNo) {
            acc.subordinates = [...acc.subordinates, curr]
          }
          periodOfDay = curr.periodOfDay
          return acc
        },
        {
          me: [],
          subordinates: [],
        }
      )

      data.data = mappingRequests
      data.periodOfDay = periodOfDay

      return data
    },
    {
      keepPreviousData: true,
      staleTime: 0,
      retry: false,
      enabled: !!requestId,
      refetchOnWindowFocus: false,
    }
  )
}
