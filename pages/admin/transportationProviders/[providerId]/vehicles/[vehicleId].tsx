import { useState, useEffect } from "react"
import TabLayout from "../../../../../components/admin/transportationProviders/TabLayout"
import Edit from "../../../../../components/admin/transportationProviders/vehicles/Edit"
import { getOne } from "../../../../../data-hooks/transportationProviders/vehicles/getOne"
import { getListTransportationVehicleTypes } from "../../../../../data-hooks/transportationProviders/vehicles/getListTransportationVehicleTypes"
import { useRouter } from "next/router"
import { useToast, Flex, Center, Spinner } from "@chakra-ui/react"
import { getDriverOptions } from "../../../../../data-hooks/transportationProviders/drivers/getList"
import { useUpdate } from "../../../../../data-hooks/transportationProviders/vehicles/update"
import { useDelete } from "../../../../../data-hooks/transportationProviders/vehicles/delete"
import get from "lodash/get"

const VehicleEdit = () => {
  const router = useRouter()
  const providerId = router?.query?.providerId
  const vehicleId = router?.query?.vehicleId
  const toast = useToast()
  const toastId1 = "error_vehicle"
  const toastId2 = "error_vehicleTypes"
  const toastId3 = "error_drivers"
  const toastId4 = "update_success"
  const toastId5 = "update_error"
  const toastId6 = "delete_success"
  const toastId7 = "delete_error"
  const vehicle = getOne(providerId, vehicleId)
  const vehicleTypes = getListTransportationVehicleTypes(providerId)
  const drivers = getDriverOptions(providerId)
  const update = useUpdate()
  const onDelete = useDelete()

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
    if (vehicle.error || vehicle.data?.error) {
      if (!toast.isActive(toastId1) && get(vehicle, "error.status") !== 401) {
        toast({
          id: toastId1,
          title: "Vehicle",
          description: vehicle.data?.error?.message
            ? vehicle.data?.error?.message
            : `${get(vehicle, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
    if (vehicleTypes.error || vehicleTypes.data?.error) {
      if (
        !toast.isActive(toastId2) &&
        get(vehicleTypes, "error.status") !== 401
      ) {
        toast({
          id: toastId2,
          title: "Vehicle Types",
          description: vehicleTypes.data?.error?.message
            ? vehicleTypes.data?.error?.message
            : `${get(vehicleTypes, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
    if (drivers.error || drivers.data?.error) {
      if (!toast.isActive(toastId2) && get(drivers, "error.status") !== 401) {
        toast({
          id: toastId3,
          title: "Drivers",
          description: drivers.data?.error?.message
            ? drivers.data?.error?.message
            : `${get(drivers, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [
    vehicle.error,
    vehicle.data?.error,
    vehicleTypes.error,
    vehicleTypes.data?.error,
    drivers.error,
    drivers.data?.error,
    toast,
  ])

  if (
    ((vehicle.isLoading || vehicle.isFetching) && !vehicle.isError) ||
    ((vehicleTypes.isLoading || vehicleTypes.isFetching) &&
      !vehicleTypes.isError) ||
    ((drivers.isLoading || drivers.isFetching) && !drivers.isError) ||
    !vehicle.data?.data ||
    !vehicleTypes.data?.data ||
    !drivers.data?.data
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
    <TabLayout index={1} type="edit">
      <Edit
        data={vehicle.data?.data}
        vehicleTypes={vehicleTypes.data?.data}
        drivers={drivers.data?.data}
        transportationProviderId={providerId}
        onSubmit={update.mutate}
        isLoading={update.isLoading}
        onDelete={onDelete.mutate}
        isLoadingDelete={onDelete.isLoading}
      />
    </TabLayout>
  )
}

export default VehicleEdit
