import { useEffect } from "react"
import TabLayout from "../../../../../components/admin/transportationProviders/TabLayout"
import Create from "../../../../../components/admin/transportationProviders/vehicles/Create"
import { getListTransportationVehicleTypes } from "../../../../../data-hooks/transportationProviders/vehicles/getListTransportationVehicleTypes"
import { useRouter } from "next/router"
import { useToast, Flex, Center, Spinner } from "@chakra-ui/react"
import { getDriverOptions } from "../../../../../data-hooks/transportationProviders/drivers/getList"
import { useCreate } from "../../../../../data-hooks/transportationProviders/vehicles/create"
import get from "lodash/get"

const VehicleCreate = () => {
  const router = useRouter()
  const providerId = router?.query?.providerId
  const toast = useToast()
  const toastId1 = "error_vehicleTypes"
  const toastId2 = "error_drivers"
  const toastId3 = "create_success"
  const toastId4 = "create_error"
  const vehicleTypes = getListTransportationVehicleTypes(providerId)
  const drivers = getDriverOptions(providerId)
  const create = useCreate()

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
    if (create.isError) {
      if (!toast.isActive(toastId4) && get(create, "error.status") !== 401) {
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
    if (vehicleTypes.error || vehicleTypes.data?.error) {
      if (
        !toast.isActive(toastId1) &&
        get(vehicleTypes, "error.status") !== 401
      ) {
        toast({
          id: toastId1,
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
          id: toastId2,
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
    vehicleTypes.error,
    vehicleTypes.data?.error,
    drivers.error,
    drivers.data?.error,
    toast,
  ])

  if (
    ((vehicleTypes.isLoading || vehicleTypes.isFetching) &&
      !vehicleTypes.isError) ||
    ((drivers.isLoading || drivers.isFetching) && !drivers.isError) ||
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
    <TabLayout index={1} type="create">
      <Create
        vehicleTypes={vehicleTypes.data?.data}
        drivers={drivers.data?.data}
        transportationProviderId={providerId}
        onSubmit={create.mutate}
        isLoading={create.isLoading}
      />
    </TabLayout>
  )
}

export default VehicleCreate
