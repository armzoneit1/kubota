/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/display-name */
/* eslint-disable react/no-children-prop */
import { useToast, useDisclosure } from "@chakra-ui/react"
import { useState, useEffect } from "react"
import { getList } from "../../../data-hooks/transportationProviders/getList"
import { getListVehicleTypes } from "../../../data-hooks/vehicleTypes/getList"
import { useCreate } from "../../../data-hooks/vehicleTypes/create"
import { useUpdate } from "../../../data-hooks/vehicleTypes/update"
import { useDelete } from "../../../data-hooks/vehicleTypes/delete"
import List from "../../../components/admin/transportationProviders/List"
import { useDelete as useDeleteProvider } from "../../../data-hooks/transportationProviders/delete"
import get from "lodash/get"

type SortByType = {
  id: string
  desc: boolean | undefined
}

const TransportationProviderList = () => {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState<string>("")
  const [sortBy, setSortBy] = useState<SortByType | undefined>(undefined)

  const { isOpen, onClose, onOpen } = useDisclosure()
  const toast = useToast()
  const toastId1 = "error_transportationProviders"
  const toastId2 = "error_vehicleTypes"
  const toastId3 = "create_success"
  const toastId4 = "create_error"
  const toastId5 = "update_success"
  const toastId6 = "update_error"
  const toastId7 = "delete_success"
  const toastId8 = "delete_error"
  const toastId9 = "deleteProvider_success"
  const toastId10 = "deleteProvider_error"
  const transportationProviders = getList(page, search, sortBy)
  const vehicleTypes = getListVehicleTypes(isOpen)
  const create = useCreate()
  const update = useUpdate()
  const onDelete = useDelete()
  const deleteProvider = useDeleteProvider()

  useEffect(() => {
    if (deleteProvider.isSuccess) {
      if (!toast.isActive(toastId9)) {
        toast({
          id: toastId9,
          description: `ลบสำเร็จ`,
          status: "success",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [deleteProvider.isSuccess, toast])

  useEffect(() => {
    if (deleteProvider.isError) {
      if (
        !toast.isActive(toastId10) &&
        get(deleteProvider, "error.status") !== 401
      ) {
        toast({
          id: toastId10,
          title: "Delete",
          description: `${get(deleteProvider, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [deleteProvider.isError, deleteProvider.error, toast])

  useEffect(() => {
    if (onDelete.isSuccess) {
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
  }, [onDelete.isSuccess, toast])

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
    if (create.isError) {
      if (!toast.isActive(toastId2) && get(create, "error.status") !== 401) {
        toast({
          id: toastId4,
          title: "Create",
          description: `${get(create, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [create.isError, create.error, toast])
  useEffect(() => {
    if (update.isError) {
      if (!toast.isActive(toastId6) && get(update, "error.status") !== 401) {
        toast({
          id: toastId6,
          title: "Update",
          description: `${get(update, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [update.isError, update.error, toast])

  useEffect(() => {
    if (onDelete.isError) {
      if (!toast.isActive(toastId8) && get(onDelete, "error.status") !== 401) {
        toast({
          id: toastId8,
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
    if (transportationProviders.error || transportationProviders.data?.error) {
      if (
        !toast.isActive(toastId1) &&
        get(transportationProviders, "error.status") !== 401
      ) {
        toast({
          id: toastId1,
          title: "Transportation Provider",
          description: transportationProviders.data?.error?.message
            ? transportationProviders.data?.error?.message
            : `${get(transportationProviders, "error.message")}`,
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
  }, [
    transportationProviders.error,
    transportationProviders.data?.error,
    vehicleTypes.error,
    vehicleTypes.data?.error,
    toast,
  ])

  return (
    <List
      data={transportationProviders.data?.data}
      vehicleTypes={vehicleTypes.data?.data}
      setPage={setPage}
      pageCount={transportationProviders.data?.pageCount}
      setSearch={setSearch}
      search={search}
      isLoading={
        transportationProviders.isLoading && !transportationProviders.error
      }
      vehicleTypesIsLoading={
        (vehicleTypes.isLoading || vehicleTypes.isFetching) &&
        !vehicleTypes.error
      }
      setSort={setSortBy}
      sortBy={sortBy}
      currentPage={transportationProviders.data?.page}
      isSubmitLoading={
        create.isLoading || update.isLoading || onDelete.isLoading
      }
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
      onCreate={create.mutate}
      onUpdate={update.mutate}
      onDelete={onDelete.mutate}
      onDeleteProvider={deleteProvider.mutate}
      isLoadingDelete={deleteProvider.isLoading}
    />
  )
}

export default TransportationProviderList
