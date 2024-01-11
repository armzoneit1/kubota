import Update from "../../../../components/employee/registration/Update"
import { getMe } from "../../../../data-hooks/me/getMe"
import { Flex, Center, Spinner, useToast } from "@chakra-ui/react"
import { useEffect } from "react"
import { getAll } from "../../../../data-hooks/busLines/getList"
import { useUpdate } from "../../../../data-hooks/registration/update"
import { useDeleteSupervisor } from "../../../../data-hooks/registration/deleteSupervisor"
import get from "lodash/get"
import { getAreaList } from "../../../../data-hooks/requests/getAreaList"

const UpdateRegistration = () => {
  const toast = useToast()
  const toastId1 = "error_me"
  const toastId2 = "error_busLineMorning"
  const toastId3 = "error_busLineEvening"
  const toastId4 = "error_update"
  const toastId5 = "success_update"
  const toastId6 = "error_delete"
  const toastId7 = "success_delete"
  const toastId8 = "error_areaList"
  const me = getMe()
  const busLineMorning = getAll("morning")
  const busLineEvening = getAll("evening")
  const update = useUpdate()
  const onDeleteSupervisor = useDeleteSupervisor()
  const areas = getAreaList()

  useEffect(() => {
    if (update.isSuccess) {
      if (!toast.isActive(toastId5)) {
        toast({
          id: toastId5,
          description: `บันทึกข้อมูลเรียบร้อยเเล้ว`,
          status: "success",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [update.isSuccess, toast])

  useEffect(() => {
    if (update.isError) {
      if (!toast.isActive(toastId4) && get(update, "error.status") !== 401) {
        toast({
          id: toastId4,
          description: `${get(update, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [update.isError, update.error, toast])

  useEffect(() => {
    if (onDeleteSupervisor.isSuccess) {
      if (!toast.isActive(toastId7)) {
        toast({
          id: toastId7,
          description: `ลบสำเร็จ`,
          status: "success",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [onDeleteSupervisor.isSuccess, toast])

  useEffect(() => {
    if (onDeleteSupervisor.isError) {
      if (
        !toast.isActive(toastId6) &&
        get(onDeleteSupervisor, "error.status") !== 401
      ) {
        toast({
          id: toastId6,
          description: `${get(onDeleteSupervisor, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [onDeleteSupervisor.isError, onDeleteSupervisor.error, toast])

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
      if (!toast.isActive(toastId8) && get(areas, "error.status") !== 401) {
        toast({
          id: toastId8,
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
    <Update
      data={me?.data?.data?.bookingBusUser}
      me={me?.data?.data}
      busLineMorning={busLineMorning?.data?.data}
      busLineEvening={busLineEvening?.data?.data}
      onSubmit={update.mutate}
      isLoading={update.isLoading}
      onDeleteSupervisor={onDeleteSupervisor.mutate}
      isLoadingDelete={onDeleteSupervisor.isLoading}
      areas={areas?.data?.data}
    />
  )
}

export default UpdateRegistration
