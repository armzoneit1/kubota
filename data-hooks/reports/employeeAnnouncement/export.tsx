/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../../providers/http-client"
import { useMutation } from "react-query"
import { EmployeeAnnouncementDataTypes } from "./types"
import download from "downloadjs"

export const useExport = () => {
  const axios = useAxios()

  return useMutation(async (data: EmployeeAnnouncementDataTypes) => {
    return axios
      .post("/downloadReports/employeeAnnouncement", data, {
        responseType: "blob",
      })
      .then((res) => {
        return download(
          res.data,
          `employee-announcement-${data?.date}-${
            data?.periodOfDay === "morning" ? "รอบไป" : "รอบกลับ"
          }.xlsx`,
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
      })
  })
}
