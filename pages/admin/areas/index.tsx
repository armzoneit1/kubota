/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/display-name */
/* eslint-disable react/no-children-prop */
import { useToast } from "@chakra-ui/react"
import { useState, useEffect } from "react"
import { getList } from "../../../data-hooks/areas/getList"
import List from "../../../components/admin/areas/List"
import { useUpdateRank } from "../../../data-hooks/areas/updateRank"
import { useDelete } from "../../../data-hooks/areas/delete"
import get from "lodash/get"

const AreaList = () => {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState<string>("")
  const [data, setData] = useState<any>([])
  const toast = useToast()
  const toastId1 = "error"
  const toastId2 = "success_updateRank"
  const toastId3 = "error_updateRank"
  const toastId4 = "delete_success"
  const toastId5 = "delete_error"
  const areas = getList(page, search)
  const updateRank = useUpdateRank()
  const onDelete = useDelete()

  useEffect(() => {
    if (onDelete.isSuccess) {
      if (!toast.isActive(toastId4)) {
        toast({
          id: toastId4,
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
      if (!toast.isActive(toastId5) && get(onDelete, "error.status") !== 401) {
        toast({
          id: toastId5,
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
    if (updateRank.isSuccess) {
      if (!toast.isActive(toastId2)) {
        toast({
          id: toastId2,
          description: `บันทึกลำดับสำเร็จ`,
          status: "success",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [updateRank.isSuccess, toast])

  useEffect(() => {
    if (updateRank.isError) {
      if (
        !toast.isActive(toastId3) &&
        get(updateRank, "error.status") !== 401
      ) {
        toast({
          id: toastId3,
          description: `${get(updateRank, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [updateRank.isError, updateRank.error, toast])

  useEffect(() => {
    if (areas.error || areas.data?.error) {
      if (!toast.isActive(toastId1) && get(areas, "error.status") !== 401) {
        toast({
          id: toastId1,
          description: areas.data?.error?.message
            ? areas.data?.error?.message
            : `${get(areas, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [areas.error, areas.data?.error, toast])

  useEffect(() => {
    setData(areas.data?.data)
  }, [areas.data?.data, areas.dataUpdatedAt])

  const handleSetData = (data: any[]) => {
    updateRank.mutate({ data: data })
    setData(data)
  }

  return (
    <List
      data={data}
      setPage={setPage}
      pageCount={areas.data?.pageCount}
      setSearch={setSearch}
      search={search}
      isLoading={areas.isLoading}
      currentPage={areas.data?.page}
      setData={handleSetData}
      onDelete={onDelete.mutate}
      isLoadingDelete={onDelete.isLoading}
    />
  )
}

export default AreaList
