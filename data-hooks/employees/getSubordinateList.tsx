/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../providers/http-client"
import { useQuery } from "react-query"

export type Option = {
  value: string
  label: string
  supervisorEmployeeNo: string
}

export const getSubordinateList = (
  employeeId: string | string[] | undefined
) => {
  const axios = useAxios()

  return useQuery(
    "subordinateList_admin",
    async () => {
      const { data } = await axios.get(`/subordinates/admin/${employeeId}`)

      return data
    },
    {
      keepPreviousData: true,
      staleTime: 0,
      retry: false,
      refetchOnWindowFocus: false,
      enabled: !!employeeId,
    }
  )
}
