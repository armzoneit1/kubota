import Edit from "../../../../../../components/admin/plannings/EditSchedule"
import {
  getOne,
  getOneSchedule,
} from "../../../../../../data-hooks/busArrangements/getOne"
import { getList } from "../../../../../../data-hooks/timeTables/getList"
import { Flex, Center, Spinner, useToast } from "@chakra-ui/react"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { useUpdateTimeTable } from "../../../../../../data-hooks/busArrangements/updateTimeTable"
import get from "lodash/get"

const EditSchedule = () => {
  const router = useRouter()
  const scheduleId = router?.query?.id
  const busArrangement = getOne(scheduleId, "morning")
  const schedule = getOneSchedule(scheduleId, "morning")
  const timeTables = getList("", "morning")
  const updateTimeTable = useUpdateTimeTable()
  const toast = useToast()
  const toastId1 = "error_planning"
  const toastId2 = "error_timeTables"
  const toastId3 = "error_schedule"
  const toastId4 = "error_updateTimeTable"
  const toastId5 = "success_updateTimeTable"

  useEffect(() => {
    if (updateTimeTable.isSuccess) {
      if (!toast.isActive(toastId5)) {
        toast({
          id: toastId5,
          description: `เเก้ไขเวลาสำเร็จ`,
          status: "success",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [updateTimeTable.isSuccess, toast])

  useEffect(() => {
    if (updateTimeTable.isError) {
      if (
        !toast.isActive(toastId4) &&
        get(updateTimeTable, "error.status") !== 401
      ) {
        toast({
          id: toastId4,
          description: `${get(updateTimeTable, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [updateTimeTable.isError, updateTimeTable.error, toast])

  useEffect(() => {
    if (busArrangement.error || busArrangement.data?.error) {
      if (
        !toast.isActive(toastId1) &&
        get(busArrangement, "error.status") !== 401
      ) {
        toast({
          id: toastId1,
          title: "busArrangement",
          description: busArrangement.data?.error?.message
            ? busArrangement.data?.error?.message
            : `${get(busArrangement, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
    if (schedule.error || schedule.data?.error) {
      if (!toast.isActive(toastId3) && get(schedule, "error.status") !== 401) {
        toast({
          id: toastId3,
          title: "schedule",
          description: schedule.data?.error?.message
            ? schedule.data?.error?.message
            : `${get(schedule, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [
    busArrangement.error,
    busArrangement.data?.error,
    schedule.error,
    schedule.data?.error,
    toast,
  ])

  useEffect(() => {
    if (timeTables.error || timeTables.data?.error) {
      if (
        !toast.isActive(toastId2) &&
        get(timeTables, "error.status") !== 401
      ) {
        toast({
          id: toastId2,
          title: "timeTables",
          description: timeTables.data?.error?.message
            ? timeTables.data?.error?.message
            : `${get(timeTables, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [timeTables.error, timeTables.data?.error, toast])

  if (
    (busArrangement.isLoading ||
      busArrangement.isFetching ||
      timeTables.isLoading ||
      timeTables.isFetching ||
      schedule.isLoading ||
      schedule.isFetching) &&
    !busArrangement.error &&
    !timeTables.error &&
    !schedule.error
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
    <Edit
      periodOfDay="morning"
      data={busArrangement.data?.data}
      timeTables={timeTables.data?.data}
      schedule={schedule?.data?.data}
      onSubmit={updateTimeTable?.mutate}
      isLoading={updateTimeTable?.isLoading}
    />
  )
}

export default EditSchedule
