import List from "../../../components/employee/subordinates/List"
import { getList } from "../../../data-hooks/subordinates/getList"
import { useToast } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { useDeleteSubordinate } from "../../../data-hooks/subordinates/deleteSubordinate"
import get from "lodash/get"

type SortByType = {
  id: string
  desc: boolean | undefined
}

const SubordinateList = () => {
  const [sortBy, setSortBy] = useState<SortByType | undefined>({
    id: "employeeNo",
    desc: false,
  })
  const toast = useToast()
  const subordinates = getList(sortBy)
  const onDeleteSubordinate = useDeleteSubordinate()
  const toastId1 = "error_subordinates"
  const toastId2 = "error_delete"
  const toastId3 = "success_delete"

  useEffect(() => {
    if (onDeleteSubordinate.isSuccess) {
      if (!toast.isActive(toastId2)) {
        toast({
          id: toastId2,
          description: `ลบสำเร็จ`,
          status: "success",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [onDeleteSubordinate.isSuccess, toast])

  useEffect(() => {
    if (onDeleteSubordinate.isError) {
      if (
        !toast.isActive(toastId3) &&
        get(onDeleteSubordinate, "error.status") !== 401
      ) {
        toast({
          id: toastId3,
          description: `${get(onDeleteSubordinate, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [onDeleteSubordinate.isError, onDeleteSubordinate.error, toast])

  useEffect(() => {
    if (subordinates.error || subordinates.data?.error) {
      if (
        !toast.isActive(toastId1) &&
        get(subordinates, "error.status") !== 401
      ) {
        toast({
          id: toastId1,
          title: "Subordinate",
          description: subordinates.data?.error?.message
            ? subordinates.data?.error?.message
            : `${get(subordinates, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [subordinates.error, subordinates.data?.error, toast])

  return (
    <List
      data={subordinates.data?.data}
      isLoading={subordinates.isLoading && !subordinates.error}
      onDeleteSubordinate={onDeleteSubordinate.mutate}
      isLoadingDelete={onDeleteSubordinate.isLoading}
      setSort={setSortBy}
      sortBy={sortBy}
    />
  )
}

export default SubordinateList
