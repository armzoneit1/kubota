/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/display-name */
/* eslint-disable react/no-children-prop */
import { useEffect, useState } from "react"
import { useToast } from "@chakra-ui/react"
import List from "../../../components/admin/busLines/List"
import TabLayout from "../../../components/admin/busLines/TabLayout"
import { getList } from "../../../data-hooks/busLines/getList"
import { useUpdateRank } from "../../../data-hooks/busLines/updateRank"
import { useDelete } from "../../../data-hooks/busLines/delete"
import get from "lodash/get"

const MorningList = () => {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState<string>("")
  const [data, setData] = useState<any>([])
  const toast = useToast()
  const toastId1 = "error"
  const toastId2 = "success_updateRank"
  const toastId3 = "error_updateRank"
  const toastId4 = "delete_success"
  const toastId5 = "delete_error"
  const busLines = getList(page, search, "morning")
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
    if (busLines.error || busLines.data?.error) {
      if (!toast.isActive(toastId1) && get(busLines, "error.status") !== 401) {
        toast({
          id: toastId1,
          description: busLines.data?.error?.message
            ? busLines.data?.error?.message
            : `${get(busLines, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [busLines.error, busLines.data?.error, toast])

  useEffect(() => {
    setData(busLines.data?.data)
  }, [busLines.data?.data])

  const handleSetData = (data: any[]) => {
    updateRank.mutate({ data: data })
    setData(data)
  }

  return (
    <TabLayout index={0}>
      <List
        data={data}
        setPage={setPage}
        pageCount={busLines.data?.pageCount}
        setSearch={setSearch}
        search={search}
        isLoading={busLines.isLoading}
        currentPage={busLines.data?.page}
        setData={handleSetData}
        periodOfDay="morning"
        onDelete={onDelete.mutate}
        isLoadingDelete={onDelete.isLoading}
      />
    </TabLayout>
  )
}

export default MorningList
