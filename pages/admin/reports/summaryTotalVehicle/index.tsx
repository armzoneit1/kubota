/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/display-name */
/* eslint-disable react/no-children-prop */
import { useEffect, useState } from "react"
import { useToast } from "@chakra-ui/react"
import List from "../../../../components/admin/reports/summaryTotalVehicle/List"
import { getList } from "../../../../data-hooks/reports/summaryTotalVehicle/getList"
import {
  getListTime,
  getListTransportationProvider,
  getListTransportationProviderVehicleTypeMapping,
  getListVehicle,
} from "../../../../data-hooks/reports/summaryTotalVehicle/getFilterOptions"
import { useExport } from "../../../../data-hooks/reports/summaryTotalVehicle/export"
import get from "lodash/get"

const SummaryTotalVehicleList = () => {
  const [query, setQuery] = useState(false)
  const [filter, setFilter] = useState<{
    startDate: string
    endDate: string
    transportationProviderId: string
    time: string
    transportationProviderVehicleTypeMappingId: string
    vehicleId: string
  }>({
    startDate: "",
    endDate: "",
    transportationProviderId: "",
    time: "",
    transportationProviderVehicleTypeMappingId: "",
    vehicleId: "",
  })
  const toast = useToast()
  const toastId1 = "error_bookings"
  const toastId2 = "error_listOfTime"
  const toastId3 = "error_listOfTransportationProvider"
  const toastId4 = "error_listOfTransportationProviderVehicleTypeMapping"
  const toastId5 = "error_listOfVehicle"
  const toastId6 = "error_download"
  const toastId7 = "success_download"
  const summaryTotalVehicle = getList(
    filter.startDate,
    filter.endDate,
    filter.transportationProviderId,
    filter.time,
    filter.transportationProviderVehicleTypeMappingId,
    filter.vehicleId,
    query,
    setQuery
  )
  const listOfTime = getListTime(filter.startDate, filter.endDate)
  const listOfTransportationProvider = getListTransportationProvider(
    filter.startDate,
    filter.endDate
  )
  const listOfTransportationProviderVehicleTypeMapping = getListTransportationProviderVehicleTypeMapping(
    filter.startDate,
    filter.endDate
  )
  const listOfVehicle = getListVehicle(filter.startDate, filter.endDate)
  const download = useExport()

  useEffect(() => {
    if (download.isSuccess) {
      if (!toast.isActive(toastId7)) {
        toast({
          id: toastId7,
          description: `ดาวน์โหลดสำเร็จ`,
          status: "success",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [download.isSuccess, toast])

  useEffect(() => {
    if (download.isError) {
      if (!toast.isActive(toastId6) && get(download, "error.status") !== 401) {
        toast({
          id: toastId6,
          description: `${get(download, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [download.isError, download.error, toast])

  useEffect(() => {
    if (summaryTotalVehicle.error || summaryTotalVehicle.data?.error) {
      if (
        !toast.isActive(toastId1) &&
        get(summaryTotalVehicle, "error.status") !== 401
      ) {
        toast({
          id: toastId1,
          title: "summaryTotalVehicle",
          description: summaryTotalVehicle.data?.error?.message
            ? summaryTotalVehicle.data?.error?.message
            : `${get(summaryTotalVehicle, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [summaryTotalVehicle.error, summaryTotalVehicle.data?.error, toast])

  useEffect(() => {
    if (listOfTime.error || listOfTime.data?.error) {
      if (
        !toast.isActive(toastId2) &&
        get(listOfTime, "error.status") !== 401
      ) {
        toast({
          id: toastId2,
          title: "listOfTime",
          description: listOfTime.data?.error?.message
            ? listOfTime.data?.error?.message
            : `${get(listOfTime, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [listOfTime.error, listOfTime.data?.error, toast])

  useEffect(() => {
    if (
      listOfTransportationProvider.error ||
      listOfTransportationProvider.data?.error
    ) {
      if (
        !toast.isActive(toastId3) &&
        get(listOfTransportationProvider, "error.status") !== 401
      ) {
        toast({
          id: toastId3,
          title: "listOfTransportationProvider",
          description: listOfTransportationProvider.data?.error?.message
            ? listOfTransportationProvider.data?.error?.message
            : `${get(listOfTransportationProvider, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [
    listOfTransportationProvider.error,
    listOfTransportationProvider.data?.error,
    toast,
  ])
  useEffect(() => {
    if (
      listOfTransportationProviderVehicleTypeMapping.error ||
      listOfTransportationProviderVehicleTypeMapping.data?.error
    ) {
      if (
        !toast.isActive(toastId4) &&
        get(listOfTransportationProviderVehicleTypeMapping, "error.status") !==
          401
      ) {
        toast({
          id: toastId4,
          title: "listOfTransportationProviderVehicleTypeMapping",
          description: listOfTransportationProviderVehicleTypeMapping.data
            ?.error?.message
            ? listOfTransportationProviderVehicleTypeMapping.data?.error
                ?.message
            : `${get(
                listOfTransportationProviderVehicleTypeMapping,
                "error.message"
              )}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [
    listOfTransportationProviderVehicleTypeMapping.error,
    listOfTransportationProviderVehicleTypeMapping.data?.error,
    toast,
  ])
  useEffect(() => {
    if (listOfVehicle.error || listOfVehicle.data?.error) {
      if (
        !toast.isActive(toastId5) &&
        get(listOfVehicle, "error.status") !== 401
      ) {
        toast({
          id: toastId5,
          title: "listOfVehicle",
          description: listOfVehicle.data?.error?.message
            ? listOfVehicle.data?.error?.message
            : `${get(listOfVehicle, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [listOfVehicle.error, listOfVehicle.data?.error, toast])

  return (
    <List
      data={summaryTotalVehicle.data?.data}
      dates={summaryTotalVehicle.data?.dates}
      busLines={summaryTotalVehicle.data?.busLines}
      listOfTime={listOfTime.data?.data}
      listOfTransportationProvider={listOfTransportationProvider.data?.data}
      listOfTransportationProviderVehicleTypeMapping={
        listOfTransportationProviderVehicleTypeMapping.data?.data
      }
      listOfVehicle={listOfVehicle.data?.data}
      isLoading={
        summaryTotalVehicle.isLoading || summaryTotalVehicle.isFetching
      }
      setFilter={setFilter}
      filter={filter}
      isLoadingDownload={download.isLoading}
      download={download.mutate}
      dataForDownload={summaryTotalVehicle.data?.dataForDownload}
      isFetching={summaryTotalVehicle.isFetching}
      setQuery={setQuery}
    />
  )
}

export default SummaryTotalVehicleList
