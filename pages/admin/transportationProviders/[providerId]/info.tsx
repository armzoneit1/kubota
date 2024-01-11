import TabLayout from "../../../../components/admin/transportationProviders/TabLayout"
import { useEffect } from "react"
import { Flex, Center, Spinner, useToast } from "@chakra-ui/react"
import { getOne } from "../../../../data-hooks/transportationProviders/getOne"
import { useRouter } from "next/router"
import Edit from "../../../../components/admin/transportationProviders/Edit"
import { getList } from "../../../../data-hooks/provinces/getList"
import { getListVehicleTypesOptions } from "../../../../data-hooks/vehicleTypes/getList"
import { useUpdate } from "../../../../data-hooks/transportationProviders/update"
import { useDelete } from "../../../../data-hooks/transportationProviders/delete"
import get from "lodash/get"

const CarProviderInfo = () => {
  const router = useRouter()
  const id = router?.query?.providerId
  const transportationProvider = getOne(id)
  const vehicleTypes = getListVehicleTypesOptions()
  const provinces = getList()
  const toast = useToast()
  const update = useUpdate()
  const onDelete = useDelete()
  const toastId1 = "error_transportationProviders"
  const toastId2 = "error_provinces"
  const toastId3 = "error_vehicleTypes"
  const toastId4 = "error_update"
  const toastId5 = "success"
  const toastId6 = "deleteProvider_success"
  const toastId7 = "deleteProvider_error"

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
    if (transportationProvider.error || transportationProvider.data?.error) {
      if (
        !toast.isActive(toastId1) &&
        get(transportationProvider, "error.status") !== 401
      ) {
        toast({
          id: toastId1,
          title: "Transportation Providers",
          description: transportationProvider.data?.error?.message
            ? transportationProvider.data?.error?.message
            : `${get(transportationProvider, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
    if (provinces.error || provinces.data?.error) {
      if (!toast.isActive(toastId2) && get(provinces, "error.status") !== 401) {
        toast({
          id: toastId2,
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
    transportationProvider.error,
    transportationProvider.data?.error,
    provinces.error,
    provinces.data?.error,
    vehicleTypes.error,
    vehicleTypes.data?.error,
    toast,
  ])

  if (
    (transportationProvider.isLoading ||
      provinces.isLoading ||
      vehicleTypes.isLoading ||
      transportationProvider.isFetching ||
      provinces.isFetching ||
      vehicleTypes.isFetching) &&
    !transportationProvider.error &&
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
    <TabLayout index={0} type="edit">
      <Edit
        data={transportationProvider.data?.data}
        provinces={provinces.data?.data}
        vehicleTypes={vehicleTypes.data?.data}
        onSubmit={update.mutate}
        isLoading={update.isLoading}
        onDelete={onDelete.mutate}
        isLoadingDelete={onDelete.isLoading}
      />
    </TabLayout>
  )
}

export default CarProviderInfo
