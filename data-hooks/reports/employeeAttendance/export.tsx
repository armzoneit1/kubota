/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../../providers/http-client"
import { useMutation } from "react-query"
import { EmployeeAttendanceDataTypes } from "./types"
import download from "downloadjs"

export const useExport = () => {
  const axios = useAxios()

  return useMutation(async (data: EmployeeAttendanceDataTypes) => {
    return axios
      .post("/downloadReports/employeeAttendance", data, {
        responseType: "blob",
      })
      .then((res) => {
        return download(
          res.data,
          `employee-attendance-${data?.date}.xlsx`,
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
      })
  })
}
