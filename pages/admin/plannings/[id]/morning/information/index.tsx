import List from "../../../../../../components/admin/plannings/MoreInformation"
import { getOneMoreInformation } from "../../../../../../data-hooks/busArrangements/getOneInformation"
import { Flex, Center, Spinner, useToast } from "@chakra-ui/react"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { getListVehicle } from "../../../../../../data-hooks/busArrangements/getListVehicle"
import { getListDriver } from "../../../../../../data-hooks/busArrangements/getListDriver"
import some from "lodash/some"
import { useUpdateInformation } from "../../../../../../data-hooks/busArrangements/updateInformation"
import { useAddDriver } from "../../../../../../data-hooks/busArrangements/addDriver"
import get from "lodash/get"

const MoreInformation = () => {
  const router = useRouter()
  const [isUpdating, setIsUpdating] = useState(false)
  const scheduleId = router?.query?.id
  const busArrangement = getOneMoreInformation(scheduleId, "morning")
  const listVehicle = getListVehicle(
    busArrangement?.data?.transportationProviderVehicleTypeMappingIds
      ? busArrangement?.data?.transportationProviderVehicleTypeMappingIds
      : []
  )
  const listDriver = getListDriver(
    busArrangement?.data?.transportationProviderId
      ? busArrangement?.data?.transportationProviderId
      : []
  )
  const updateInformation = useUpdateInformation()
  const addDriver = useAddDriver()

  const toast = useToast()
  const toastId1 = "error_busArrangement"
  const toastId2 = "error_listVehicle"
  const toastId3 = "error_listDriver"
  const toastId4 = "error_updateInformation"
  const toastId5 = "success_updateInformation"
  const toastId6 = "error_addDriver"
  const toastId7 = "success_addDriver"

  useEffect(() => {
    if (addDriver.isSuccess) {
      if (!toast.isActive(toastId7)) {
        toast({
          id: toastId7,
          description: `เพิ่มสำเร็จ`,
          status: "success",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [addDriver.isSuccess, toast])

  useEffect(() => {
    if (addDriver.isError) {
      if (!toast.isActive(toastId6) && get(addDriver, "error.status") !== 401) {
        toast({
          id: toastId6,
          description: `${get(addDriver, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [addDriver.isError, addDriver.error, toast])

  useEffect(() => {
    if (updateInformation.isSuccess) {
      if (!toast.isActive(toastId5)) {
        toast({
          id: toastId5,
          description: `บันทึกสำเร็จ`,
          status: "success",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [updateInformation.isSuccess, toast])

  useEffect(() => {
    if (updateInformation.isError) {
      if (
        !toast.isActive(toastId4) &&
        get(updateInformation, "error.status") !== 401
      ) {
        toast({
          id: toastId4,
          description: `${get(updateInformation, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [updateInformation.isError, updateInformation.error, toast])

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
    if (some(listVehicle, "error") || some(listVehicle, "data.error")) {
      if (
        !toast.isActive(toastId2) &&
        get(some(listVehicle, "error"), "status") !== 401
      ) {
        toast({
          id: toastId2,
          title: "listVehicle",
          description: some(listVehicle, "data.error.message")
            ? some(listVehicle, "data.error.message")
            : `${get(some(listVehicle, "error"), "message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
    if (some(listDriver, "error") || some(listDriver, "data.error")) {
      if (
        !toast.isActive(toastId3) &&
        get(some(listDriver, "error"), "status") !== 401
      ) {
        toast({
          id: toastId3,
          title: "listDriver",
          description: some(listDriver, "data.error.message")
            ? some(listDriver, "data.error.message")
            : `${get(some(listDriver, "error"), "message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [
    busArrangement.error,
    busArrangement.data?.error,
    some(listVehicle, "error"),
    some(listVehicle, "data.error"),
    some(listDriver, "error"),
    some(listDriver, "data.error"),
    toast,
    listDriver,
    listVehicle,
  ])

  if (
    (busArrangement.isLoading ||
      (busArrangement?.isFetching && !isUpdating) ||
      some(listVehicle, "isLoading") ||
      some(listDriver, "isLoading")) &&
    !busArrangement.error &&
    !some(listVehicle, "error") &&
    !some(listDriver, "error")
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
    <List
      data={busArrangement.data?.data}
      isLoading={busArrangement.isLoading}
      timeTableRounds={busArrangement.data?.timeTableRounds}
      periodOfDay="morning"
      vehicleList={
        listVehicle && listVehicle.length > 0
          ? listVehicle.reduce((acc: any[], curr: any) => {
              if (curr?.data?.data) acc.push(...curr?.data?.data)
              return acc
            }, [])
          : null
      }
      driverList={
        listDriver && listDriver.length > 0
          ? listDriver.reduce((acc: any[], curr: any) => {
              if (curr?.data?.data) acc.push(...curr?.data?.data)
              return acc
            }, [])
          : null
      }
      updateInformation={updateInformation?.mutate}
      isLoadingUpdateInformation={updateInformation?.isLoading}
      addDriver={addDriver?.mutate}
      isLoadingAddDriver={addDriver?.isLoading}
      setIsUpdating={setIsUpdating}
    />
  )
}

export default MoreInformation
