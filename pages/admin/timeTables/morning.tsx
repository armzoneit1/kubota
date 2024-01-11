import { useState, useEffect } from "react"
import { Box, Flex, useToast, Center, Spinner } from "@chakra-ui/react"
import ConfirmDialog from "../../../components/ConfirmDialog"
import TabLayout from "../../../components/admin/timeTables/TabLayout"
import List from "../../../components/admin/timeTables/List"
import { getList } from "../../../data-hooks/timeTables/getList"
import { useDelete } from "../../../data-hooks/timeTables/delete"
import get from "lodash/get"

const MorningList = () => {
  const [isOpen, setOpen] = useState(false)
  const [selected, setSelected] = useState<{
    id: number | null
    name: string | null
  }>({ id: null, name: null })
  const toast = useToast()
  const toastId1 = "error"
  const toastId2 = "delete_success"
  const toastId3 = "delete_error"
  const [search, setSearch] = useState<string>("")
  const { isLoading, error, data, isFetching } = getList(search, "morning")
  const onDelete = useDelete()

  useEffect(() => {
    if (onDelete.isSuccess) {
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
  }, [onDelete.isSuccess, toast])

  useEffect(() => {
    if (onDelete.isError) {
      if (!toast.isActive(toastId3) && get(onDelete, "error.status") !== 401) {
        toast({
          id: toastId3,
          title: "Delete",
          description: `${get(onDelete, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [onDelete.isError, onDelete.error, toast])

  const onOpen = (id: number, name: string) => {
    setSelected({ id, name })
    setOpen(true)
  }
  const onClose = () => {
    setOpen(false)
  }

  useEffect(() => {
    if (error || data?.error) {
      if (!toast.isActive(toastId1) && get(data, "error.status") !== 401) {
        toast({
          id: toastId1,
          description: data?.error?.message
            ? data?.error?.message
            : `${get(data, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [error, data?.error, toast])

  return (
    <Box>
      <Box>
        <ConfirmDialog
          isOpen={isOpen}
          onClose={onClose}
          type="error"
          title={"ลบข้อมูล"}
          content={
            <>
              คุณยืนยันการลบข้อมูลของ {selected.name} ใช่หรือไม่ ? <br /> <br />
              หมายเหตุ
              การลบรอบการจัดรถจะส่งผลให้รายการจองด้วยรอบเวลาดังกล่าวถูกยกเลิก
            </>
          }
          acceptLabel="ลบ"
          onSubmit={() => {
            if (selected.id) onDelete.mutate(selected.id)
            onClose()
          }}
        />

        <TabLayout index={0} setSearch={setSearch} search={search}>
          {isLoading && !error ? (
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
          ) : (
            <List data={data?.data} onOpen={onOpen} periodOfDay="morning" />
          )}
        </TabLayout>
      </Box>
    </Box>
  )
}

export default MorningList
