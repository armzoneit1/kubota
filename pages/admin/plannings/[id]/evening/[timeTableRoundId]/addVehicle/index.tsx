import { useEffect } from "react"
import { Flex, Center, Spinner, useToast } from "@chakra-ui/react"
import Create from "../../../../../../../components/admin/plannings/AddVehicle"
import { useRouter } from "next/router"
import { getOneSchedule } from "../../../../../../../data-hooks/busArrangements/getOne"
import { getListBookingPassenger } from "../../../../../../../data-hooks/busArrangements/getListBookingPassenger"
import { getListVehicleType } from "../../../../../../../data-hooks/busArrangements/getListVehicleType"
import { useAddBookingVehicle } from "../../../../../../../data-hooks/busArrangements/addBookingVehicle"
import { getAll } from "../../../../../../../data-hooks/busLines/getList"
import get from "lodash/get"

const AddVehicle = () => {
  const router = useRouter()
  const scheduleId = router?.query?.id
  const timeTableRoundId = router?.query?.timeTableRoundId
  const schedule = getOneSchedule(scheduleId, "evening")
  const busLines = getAll("evening")
  const vehicleTypes = getListVehicleType()
  const bookingPassengers = getListBookingPassenger(
    scheduleId,
    "evening",
    timeTableRoundId
  )
  const addBookingVehicle = useAddBookingVehicle()
  const toast = useToast()
  const toastId2 = "error_listBookingPassenger"
  const toastId3 = "error_listVehicleType"
  const toastId4 = "error_addBookingVehicle"
  const toastId5 = "success_addBookingVehicle"
  const toastId6 = "error_busLines"
  const toastId7 = "error_schedule"

  useEffect(() => {
    if (addBookingVehicle.isSuccess) {
      if (!toast.isActive(toastId5)) {
        toast({
          id: toastId5,
          description: `เพิ่มสำเร็จ`,
          status: "success",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [addBookingVehicle.isSuccess, toast])

  useEffect(() => {
    if (addBookingVehicle.isError) {
      if (
        !toast.isActive(toastId4) &&
        get(addBookingVehicle, "error.status") !== 401
      ) {
        toast({
          id: toastId4,
          description: `${get(addBookingVehicle, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [addBookingVehicle.isError, addBookingVehicle.error, toast])

  useEffect(() => {
    if (busLines.error || busLines.data?.error) {
      if (!toast.isActive(toastId6) && get(busLines, "error.status") !== 401) {
        toast({
          id: toastId6,
          title: "busLine",
          description: busLines.data?.error?.message
            ? busLines.data?.error?.message
            : `${get(busLines, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
    if (schedule.error || schedule.data?.error) {
      if (!toast.isActive(toastId7) && get(schedule, "error.status") !== 401) {
        toast({
          id: toastId7,
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
    if (bookingPassengers.error || bookingPassengers.data?.error) {
      if (
        !toast.isActive(toastId2) &&
        get(bookingPassengers, "error.status") !== 401
      ) {
        toast({
          id: toastId2,
          title: "bookingPassengers",
          description: bookingPassengers.data?.error?.message
            ? bookingPassengers.data?.error?.message
            : `${get(bookingPassengers, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
    if (vehicleTypes.error || vehicleTypes.data?.error) {
      if (
        !toast.isActive(toastId3) &&
        get(vehicleTypes, "error.status") !== 401
      ) {
        toast({
          id: toastId3,
          title: "vehicleTypes",
          description: vehicleTypes.data?.error?.message
            ? vehicleTypes.data?.error?.message
            : `${get(vehicleTypes, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [
    busLines.error,
    busLines.data?.error,
    schedule.error,
    schedule.data?.error,
    bookingPassengers.error,
    bookingPassengers.data?.error,
    vehicleTypes.error,
    vehicleTypes.data?.error,
    toast,
  ])

  if (
    (bookingPassengers.isLoading ||
      bookingPassengers.isFetching ||
      vehicleTypes.isLoading ||
      vehicleTypes.isFetching ||
      busLines.isLoading ||
      busLines.isFetching ||
      schedule.isLoading ||
      schedule.isFetching) &&
    !bookingPassengers.error &&
    !vehicleTypes.error &&
    !busLines.error &&
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
    <Create
      periodOfDay="evening"
      vehicleTypes={vehicleTypes?.data?.data}
      bookingPassengers={bookingPassengers?.data?.data}
      onSubmit={addBookingVehicle.mutate}
      isLoading={addBookingVehicle.isLoading}
      busLines={busLines.data?.data}
      rounds={schedule.data?.data}
    />
  )
}

export default AddVehicle
