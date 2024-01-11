/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../providers/http-client"
import { useQuery } from "react-query"
import { EmployeeDataTypes } from "./types"

export type Option = {
  value: string
  label: string
  supervisorEmployeeNo: string
  name: string
}

export const getEmpList = () => {
  const axios = useAxios()

  return useQuery(
    "myHrEmployeeList",
    async () => {
      const { data } = await axios.get(`/myHrEmployees`)

      const filteredData = data.data.reduce(
        (acc: Option[], curr: EmployeeDataTypes) => {
          acc.push({
            value: curr.employeeNo,
            label: `${curr.employeeNo} ${curr.title}${curr.firstName} ${curr.lastName}`,
            supervisorEmployeeNo: curr.supervisorEmployeeNo,
            name: `${curr.title}${curr.firstName} ${curr.lastName}`,
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
