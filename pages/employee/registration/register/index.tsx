import Register from "../../../../components/employee/registration/Register"
import { getMe } from "../../../../data-hooks/me/getMe"
import { Flex, Center, Spinner, useToast } from "@chakra-ui/react"
import { useEffect } from "react"
import { getAll } from "../../../../data-hooks/busLines/getList"
import { useRegister } from "../../../../data-hooks/registration/register"
import router from "next/router"
import { getAreaList } from "../../../../data-hooks/requests/getAreaList"
import get from "lodash/get"

const Registration = () => {
  const toast = useToast()
  const toastId1 = "error_me"
  const toastId2 = "error_busLineMorning"
  const toastId3 = "error_busLineEvening"
  const toastId4 = "success_register"
  const toastId5 = "error_register"
  const toastId6 = "error_areaList"
  const me = getMe()
  const busLineMorning = getAll("morning")
  const busLineEvening = getAll("evening")
  const register = useRegister()
  const areas = getAreaList()

  useEffect(() => {
    if (register.isSuccess) {
      if (!toast.isActive(toastId4)) {
        toast({
          id: toastId4,
          description: `ลงทะเบียนสำเร็จ`,
          status: "success",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [register.isSuccess, toast])

  useEffect(() => {
    if (register.isError) {
      if (!toast.isActive(toastId5) && get(register, "error.status") !== 401) {
        toast({
          id: toastId5,
          description: `${get(register, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [register.isError, register.error, toast])

  useEffect(() => {
    if (me.error || me.data?.error) {
      if (!toast.isActive(toastId1) && get(me, "error.status") !== 401) {
        toast({
          id: toastId1,

          description: me.data?.error?.message
            ? me.data?.error?.message
            : `${get(me, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
    if (busLineMorning.error || busLineMorning.data?.error) {
      if (
        !toast.isActive(toastId2) &&
        get(busLineMorning, "error.status") !== 401
      ) {
        toast({
          id: toastId2,
          title: "BusLineMorning",
          description: busLineMorning.data?.error?.message
            ? busLineMorning.data?.error?.message
            : `${get(busLineMorning, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
    if (busLineEvening.error || busLineEvening.data?.error) {
      if (
        !toast.isActive(toastId3) &&
        get(busLineEvening, "error.status") !== 401
      ) {
        toast({
          id: toastId3,
          title: "BusLineEvening",
          description: busLineEvening.data?.error?.message
            ? busLineEvening.data?.error?.message
            : `${get(busLineEvening, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
    if (areas.error || areas.data?.error) {
      if (!toast.isActive(toastId6) && get(areas, "error.status") !== 401) {
        toast({
          id: toastId6,
          title: "Areas",
          description: areas.data?.error?.message
            ? areas.data?.error?.message
            : `${get(areas, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [
    me.error,
    me.data?.error,
    busLineMorning.error,
    busLineMorning.data?.error,
    busLineEvening.error,
    busLineEvening.data?.error,
    areas.error,
    areas.data?.error,
    toast,
  ])

  useEffect(() => {
    if (me?.data?.data?.bookingBusUser)
      router.push("/employee/registration/update")
  }, [me?.data?.data?.bookingBusUser])

  if (
    (me.isLoading ||
      me.isFetching ||
      busLineMorning.isLoading ||
      busLineMorning.isFetching ||
      busLineEvening.isLoading ||
      busLineEvening.isFetching ||
      areas.isLoading ||
      areas.isFetching) &&
    !me.error &&
    !busLineMorning.error &&
    !busLineEvening.error &&
    !areas.error
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
    <Register
      data={me?.data?.data?.myHrEmployee}
      busLineMorning={busLineMorning?.data?.data}
      busLineEvening={busLineEvening?.data?.data}
      onSubmit={register.mutate}
      isLoading={register.isLoading}
      areas={areas?.data?.data}
    />
  )
}

export default Registration
