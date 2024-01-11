import TabLayout from "../../../../../components/admin/transportationProviders/TabLayout"
import { useRouter } from "next/router"
import React, { useEffect } from "react"
import { useToast, Flex, Center, Spinner } from "@chakra-ui/react"
import Edit from "../../../../../components/admin/transportationProviders/drivers/Edit"
import { getOne } from "../../../../../data-hooks/transportationProviders/drivers/getOne"
import { getVehicleOptions } from "../../../../../data-hooks/transportationProviders/vehicles/getList"
import { useUpdate } from "../../../../../data-hooks/transportationProviders/drivers/update"
import { useDelete } from "../../../../../data-hooks/transportationProviders/drivers/delete"
import get from "lodash/get"

const DriverEdit = () => {
  const router = useRouter()
  const providerId = router?.query?.providerId
  const driverId = router?.query?.driverId
  const toast = useToast()
  const toastId1 = "error_driver"
  const toastId2 = "error_vehicles"
  const toastId3 = "update_success"
  const toastId4 = "update_error"
  const toastId5 = "delete_success"
  const toastId6 = "delete_error"
  const driver = getOne(providerId, driverId)
  const vehicles = getVehicleOptions(providerId)
  const update = useUpdate()
  const onDelete = useDelete()

  useEffect(() => {
    if (onDelete.isSuccess) {
      if (!toast.isActive(toastId5)) {
        toast({
          id: toastId5,
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
      if (!toast.isActive(toastId6) && get(onDelete, "error.status") !== 401) {
        toast({
          id: toastId6,
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
    if (driver.error || driver.data?.error) {
      if (!toast.isActive(toastId1) && get(driver, "error.status") !== 401) {
        toast({
          id: toastId1,
          title: "Driver",
          description: driver.data?.error?.message
            ? driver.data?.error?.message
            : `${get(driver, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
    if (vehicles.error || vehicles.data?.error) {
      if (!toast.isActive(toastId2) && get(vehicles, "error.status") !== 401) {
        toast({
          id: toastId2,
          title: "Licence Plate",
          description: vehicles.data?.error?.message
            ? vehicles.data?.error?.message
            : `${get(vehicles, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [
    driver.error,
    driver.data?.error,
    vehicles.error,
    vehicles.data?.error,
    toast,
  ])

  if (
    ((driver.isLoading || driver.isFetching) && !driver.isError) ||
    !driver.data?.data ||
    ((vehicles.isLoading || vehicles.isFetching) && !vehicles.isError) ||
    !vehicles.data?.data
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
    <TabLayout index={2} type="edit">
      <Edit
        data={driver.data?.data}
        vehicles={vehicles.data?.data}
        isLoading={update.isLoading}
        onSubmit={update.mutate}
        transportationProviderId={providerId}
        onDelete={onDelete.mutate}
        isLoadingDelete={onDelete.isLoading}
      />
    </TabLayout>
  )
}

export default DriverEdit
