/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../../providers/http-client"
import { useMutation } from "react-query"
import { SummaryTotalVehicleDataTypes } from "./types"
import download from "downloadjs"

export const useExport = () => {
  const axios = useAxios()

  return useMutation(async (data: SummaryTotalVehicleDataTypes) => {
    return axios
      .post("/downloadReports/summaryTotalVehicle", data, {
        responseType: "blob",
      })
      .then((res) => {
        return download(
          res.data,
          `summary-total-vehicle-${data?.startDate}-${data?.endDate}.xlsx`,
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
      })
  })
}
