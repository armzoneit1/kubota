import { useEffect } from "react"
import { Flex, Center, Spinner, useToast } from "@chakra-ui/react"
import { useRouter } from "next/router"
import Edit from "../../../../components/admin/schedules/daily/Edit"
import { getListTimeTableOptions } from "../../../../data-hooks/timeTables/getList"
import { useUpdate } from "../../../../data-hooks/schedules/daily/update"
import { getOne } from "../../../../data-hooks/schedules/getOne"
import { useDeleteOne } from "../../../../data-hooks/schedules/daily/delete"
import get from "lodash/get"

const OtherEdit = () => {
  const router = useRouter()
  const id = router?.query?.otherId
  const schedule = getOne(id)
  const timeTableMorning = getListTimeTableOptions("morning")
  const timeTableEvening = getListTimeTableOptions("evening")
  const update = useUpdate()
  const onDelete = useDeleteOne()
  const toast = useToast()
  const toastId1 = "error_schedule"
  const toastId2 = "error_timeTableMorning"
  const toastId3 = "error_timeTableEvening"
  const toastId4 = "success_update"
  const toastId5 = "error_update"
  const toastId6 = "delete_success"
  const toastId7 = "delete_error"

  useEffect(() => {
    if (onDelete.isSuccess) {
      if (!toast.isActive(toastId6)) {
        toast({
          id: toastId6,
          description: `ลบสำเร็จ`,
          status: "success",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [onDelete.isSuccess, toast])

  useEffect(() => {
    if (onDelete.isError) {
      if (!toast.isActive(toastId7) && get(onDelete, "error.status") !== 401) {
        toast({
          id: toastId7,
          title: "Delete",
          description: `${get(onDelete, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [onDelete.isError, onDelete.error, toast])

  useEffect(() => {
    if (update.isSuccess) {
      if (!toast.isActive(toastId4)) {
        toast({
          id: toastId4,
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
      if (!toast.isActive(toastId5) && get(update, "error.status") !== 401) {
        toast({
          id: toastId5,
          description: `${get(update, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [update.isError, update.error, toast])

  useEffect(() => {
    if (schedule.error || schedule.data?.error) {
      if (!toast.isActive(toastId1) && get(schedule, "error.status") !== 401) {
        toast({
          id: toastId1,
          title: "Schedule",
          description: schedule.data?.error?.message
            ? schedule.data?.error?.message
            : `${get(schedule, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
    if (timeTableMorning.error || timeTableMorning.data?.error) {
      if (
        !toast.isActive(toastId2) &&
        get(timeTableMorning, "error.status") !== 401
      ) {
        toast({
          id: toastId2,
          title: "Time Table Morning",
          description: timeTableMorning.data?.error?.message
            ? timeTableMorning.data?.error?.message
            : `${get(timeTableMorning, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
    if (timeTableEvening.error || timeTableEvening.data?.error) {
      if (
        !toast.isActive(toastId3) &&
        get(timeTableEvening, "error.status") !== 401
      ) {
        toast({
          id: toastId3,
          title: "Time Table Evening",
          description: timeTableEvening.data?.error?.message
            ? timeTableEvening.data?.error?.message
            : `${get(timeTableEvening, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [
    schedule.error,
    schedule.data?.error,
    timeTableMorning.error,
    timeTableMorning.data?.error,
    timeTableEvening.error,
    timeTableEvening.data?.error,
    toast,
  ])

  if (
    (timeTableMorning.isLoading ||
      timeTableMorning.isFetching ||
      timeTableEvening.isLoading ||
      timeTableEvening.isFetching ||
      schedule.isLoading ||
      schedule.isFetching) &&
    !timeTableMorning.error &&
    !timeTableEvening.error &&
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
      data={schedule.data?.data}
      day="other"
      timeTableMorningOptions={timeTableMorning.data?.data}
      timeTableEveningOptions={timeTableEvening.data?.data}
      isLoading={update.isLoading || onDelete.isLoading}
      onSubmit={update.mutate}
      onDelete={onDelete.mutate}
    />
  )
}

export default OtherEdit
