import { useEffect } from "react"
import { Flex, Center, Spinner, useToast } from "@chakra-ui/react"
import { getOne } from "../../../data-hooks/schedules/getOne"
import { useRouter } from "next/router"
import Edit from "../../../components/admin/schedules/Edit"
import { getListTimeTableOptions } from "../../../data-hooks/timeTables/getList"
import { useUpdate } from "../../../data-hooks/schedules/manageDailySchedule"
import get from "lodash/get"

const ScheduleEdit = () => {
  const router = useRouter()
  const id = router?.query?.id
  const schedule = getOne(id)
  const timeTableMorning = getListTimeTableOptions("morning")
  const timeTableEvening = getListTimeTableOptions("evening")
  const update = useUpdate()
  const toast = useToast()
  const toastId1 = "error_schedule"
  const toastId2 = "error_timeTableMorning"
  const toastId3 = "error_timeTableEvening"
  const toastId4 = "success_update"
  const toastId5 = "error_update"

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
    (schedule.isLoading ||
      schedule.isFetching ||
      timeTableMorning.isLoading ||
      timeTableMorning.isFetching ||
      timeTableEvening.isLoading ||
      timeTableEvening.isFetching) &&
    !schedule.error &&
    !timeTableMorning.error &&
    !timeTableEvening.error
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
      day={schedule.data?.data.dayType}
      timeTableMorningOptions={timeTableMorning.data?.data}
      timeTableEveningOptions={timeTableEvening.data?.data}
      isLoading={update.isLoading}
      onSubmit={update.mutate}
    />
  )
}

export default ScheduleEdit
