import TabLayout from "../../../../../components/admin/transportationProviders/TabLayout"
import { useRouter } from "next/router"
import React, { useEffect } from "react"
import { useToast, Flex, Center, Spinner } from "@chakra-ui/react"
import Create from "../../../../../components/admin/transportationProviders/drivers/Create"
import { getVehicleOptions } from "../../../../../data-hooks/transportationProviders/vehicles/getList"
import { useCreate } from "../../../../../data-hooks/transportationProviders/drivers/create"
import get from "lodash/get"

const DriverCreate = () => {
  const router = useRouter()
  const providerId = router?.query?.providerId
  const toast = useToast()
  const toastId1 = "error_licencePlates"
  const toastId2 = "update_success"
  const toastId3 = "update_error"
  const vehicles = getVehicleOptions(providerId)
  const create = useCreate()

  useEffect(() => {
    if (create.isSuccess) {
      if (!toast.isActive(toastId2)) {
        toast({
          id: toastId2,
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
      if (!toast.isActive(toastId3) && get(create, "error.status") !== 401) {
        toast({
          id: toastId3,
          description: `${get(create, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [create.isError, create.error, toast])

  useEffect(() => {
    if (vehicles.error || vehicles.data?.error) {
      if (!toast.isActive(toastId1) && get(vehicles, "error.status") !== 401) {
        toast({
          id: toastId1,
          title: "Vehicles",
          description: vehicles.data?.error?.message
            ? vehicles.data?.error?.message
            : `${get(vehicles, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [vehicles.error, vehicles.data?.error, toast])

  if (
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
    <TabLayout index={2} type="create">
      <Create
        vehicles={vehicles.data?.data}
        isLoading={create.isLoading}
        onSubmit={create.mutate}
        transportationProviderId={providerId}
      />
    </TabLayout>
  )
}

export default DriverCreate
