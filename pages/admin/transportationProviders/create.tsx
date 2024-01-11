import Create from "../../../components/admin/transportationProviders/Create"
import { useEffect } from "react"
import { getList } from "../../../data-hooks/provinces/getList"
import { useCreate } from "../../../data-hooks/transportationProviders/create"
import { Flex, Center, Spinner, useToast } from "@chakra-ui/react"
import { getListVehicleTypesOptions } from "../../../data-hooks/vehicleTypes/getList"
import get from "lodash/get"

const ProviderCreate = () => {
  const provinces = getList()
  const vehicleTypes = getListVehicleTypesOptions()
  const create = useCreate()
  const toast = useToast()
  const toastId1 = "error"
  const toastId2 = "error_create"
  const toastId3 = "error_vehicleTypes"
  const toastId4 = "success"

  useEffect(() => {
    if (create.isSuccess) {
      if (!toast.isActive(toastId4)) {
        toast({
          id: toastId4,
          description: `เพิ่มสำเร็จ`,
          status: "success",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [create.isSuccess, toast])

  useEffect(() => {
    if (provinces.error || provinces.data?.error) {
      if (!toast.isActive(toastId1) && get(provinces, "error.status") !== 401) {
        toast({
          id: toastId1,
          title: "Provinces",
          description: provinces.data?.error?.message
            ? provinces.data?.error?.message
            : `${get(provinces, "error.message")}`,
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
  }, [
    provinces.error,
    provinces.data?.error,
    vehicleTypes.error,
    vehicleTypes.data?.error,
    toast,
  ])

  useEffect(() => {
    if (create.isError) {
      if (!toast.isActive(toastId2) && get(create, "error.status") !== 401) {
        toast({
          id: toastId2,
          description: `${get(create, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [create.isError, create.error, toast])

  if (
    (provinces.isLoading ||
      vehicleTypes.isLoading ||
      provinces.isFetching ||
      vehicleTypes.isFetching) &&
    !provinces.error &&
    !vehicleTypes.error
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
      provinces={provinces.data?.data}
      vehicleTypes={vehicleTypes.data?.data}
      onSubmit={create.mutate}
      isLoading={create.isLoading}
    />
  )
}

export default ProviderCreate
