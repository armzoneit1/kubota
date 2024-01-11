import { useEffect } from "react"
import { Flex, Center, Spinner, useToast } from "@chakra-ui/react"
import Create from "../../../../components/admin/schedules/daily/Create"
import { getListTimeTableOptions } from "../../../../data-hooks/timeTables/getList"
import { useCreate } from "../../../../data-hooks/schedules/daily/create"
import get from "lodash/get"

const OtherCreate = () => {
  const timeTableMorning = getListTimeTableOptions("morning")
  const timeTableEvening = getListTimeTableOptions("evening")
  const create = useCreate()
  const toast = useToast()
  const toastId1 = "error_timeTableMorning"
  const toastId2 = "error_timeTableEvening"
  const toastId3 = "success_create"
  const toastId4 = "error_create"

  useEffect(() => {
    if (create.isSuccess) {
      if (!toast.isActive(toastId3)) {
        toast({
          id: toastId3,
          description: `เพิ่มสำเร็จ`,
          status: "success",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [create.isSuccess, toast])

  useEffect(() => {
    if (create.isError && get(create, "error.status") !== 401) {
      if (!toast.isActive(toastId4)) {
        toast({
          id: toastId4,
          description: `${get(create, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [create.isError, create.error, toast])

  useEffect(() => {
    if (timeTableMorning.error || timeTableMorning.data?.error) {
      if (
        !toast.isActive(toastId1) &&
        get(timeTableMorning, "error.status") !== 401
      ) {
        toast({
          id: toastId1,
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
        !toast.isActive(toastId2) &&
        get(timeTableEvening, "error.status") !== 401
      ) {
        toast({
          id: toastId2,
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
      timeTableEvening.isFetching) &&
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
    <Create
      day="other"
      timeTableMorningOptions={timeTableMorning.data?.data}
      timeTableEveningOptions={timeTableEvening.data?.data}
      isLoading={create.isLoading}
      onSubmit={create.mutate}
    />
  )
}

export default OtherCreate
