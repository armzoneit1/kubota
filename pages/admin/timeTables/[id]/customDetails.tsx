/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from "react"
import { Flex, Center, Spinner, useToast } from "@chakra-ui/react"
import { getOneCustomDetail } from "../../../../data-hooks/timeTables/getOneCustomDetail"
import { useUpdate } from "../../../../data-hooks/timeTables/updateCustomDetail"
import { getOne as getOneTimeTableInfo } from "../../../../data-hooks/timeTables/getOne"
import { getList as getListBusStops } from "../../../../data-hooks/busStops/getList"
import { getAll as getListBusLines } from "../../../../data-hooks/busLines/getList"
import { useRouter } from "next/router"
import TimeTableDetail from "../../../../components/admin/timeTables/TimeTableDetail"
import get from "lodash/get"

const customDetails = () => {
  const router = useRouter()
  const id = router?.query?.id
  const [isUpdating, setIsUpdating] = useState(false)
  const customDetail = getOneCustomDetail(id)
  const timeTable = getOneTimeTableInfo(id)
  const busStops = getListBusStops(customDetail.data?.data.periodOfDay)
  const busLines = getListBusLines(customDetail.data?.data.periodOfDay)
  const update = useUpdate()
  const toast = useToast()
  const toastId1 = "error_customDetail"
  const toastId2 = "error_busStops"
  const toastId3 = "error_timeTable"
  const toastId4 = "error_busLines"
  const toastId5 = "success_update"
  const toastId6 = "error_update"

  useEffect(() => {
    if (update.isSuccess) {
      if (!toast.isActive(toastId3)) {
        toast({
          id: toastId3,
          description: `บันทึกสำเร็จ`,
          status: "success",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [update.isSuccess, toast])

  useEffect(() => {
    if (update.isError) {
      if (!toast.isActive(toastId2) && get(update, "error.status") !== 401) {
        toast({
          id: toastId2,
          description: `${get(update, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [update.isError, update.error, toast])

  useEffect(() => {
    if (customDetail.error || customDetail.data?.error) {
      if (
        !toast.isActive(toastId1) &&
        get(customDetail, "error.status") !== 401
      ) {
        toast({
          id: toastId1,
          description: customDetail.data?.error?.message
            ? customDetail.data?.error?.message
            : `${get(customDetail, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
    if (busStops.error || busStops.data?.error) {
      if (!toast.isActive(toastId2) && get(busStops, "error.status") !== 401) {
        toast({
          id: toastId2,
          description: busStops.data?.error?.message
            ? busStops.data?.error?.message
            : `${get(busStops, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
    if (timeTable.error || timeTable.data?.error) {
      if (!toast.isActive(toastId3) && get(timeTable, "error.status") !== 401) {
        toast({
          id: toastId3,
          description: timeTable.data?.error?.message
            ? timeTable.data?.error?.message
            : `${get(timeTable, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
    if (busLines.error || busLines.data?.error) {
      if (!toast.isActive(toastId4) && get(busLines, "error.status") !== 401) {
        toast({
          id: toastId4,
          description: busLines.data?.error?.message
            ? busLines.data?.error?.message
            : `${get(busLines, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [
    customDetail.error,
    customDetail.data?.error,
    busStops.error,
    busStops.data?.error,
    timeTable.error,
    timeTable.data?.error,
    busLines.error,
    busLines.data?.error,
    toast,
  ])

  if (
    (customDetail.isLoading ||
      (customDetail.isFetching && !isUpdating) ||
      busStops.isLoading ||
      busStops.isFetching ||
      timeTable.isLoading ||
      timeTable.isFetching ||
      busLines.isLoading ||
      busLines.isFetching) &&
    !customDetail.error &&
    !busStops.error &&
    !timeTable.error &&
    !busLines.error
  )
    return (
      <Flex
        alignItems="center"
        width="100%"
        height="100vh"
        justifyContent="center"
      >
        <Center>
          <Spinner size="xl" color="primary.500" />
        </Center>
      </Flex>
    )

  return (
    <TimeTableDetail
      data={customDetail.data?.data}
      busStops={busStops.data?.data}
      timeTable={timeTable.data?.data}
      busLines={busLines.data?.data}
      isLoading={update.isLoading || customDetail?.isFetching}
      onSubmit={update.mutate}
      setIsUpdating={setIsUpdating}
    />
  )
}

export default customDetails
