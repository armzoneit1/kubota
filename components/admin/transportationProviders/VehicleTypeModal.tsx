import { useEffect, useState } from "react"
import {
  Modal,
  ModalOverlay,
  ModalContent,
  Flex,
  useBreakpointValue,
  Center,
  Spinner,
} from "@chakra-ui/react"
import { VehicleTypes } from "../../../data-hooks/vehicleTypes/types"
import VehicleTypeForm from "./VehicleTypeForm"

type VehicleTypeModalProps = {
  isOpen: boolean
  onClose: () => void
  onSubmit?: () => void
  vehicleTypes: VehicleTypes[]
  isLoading: boolean
  isSubmitLoading: boolean
  onCreate: (values: any) => void
  onUpdate: (values: any) => void
  onDelete: (values: any) => void
}

type UpdateData = {
  create: { id: number; name: string }[] | null
  update: { id: number; name: string }[] | null
  delete: (number | string)[] | null
}

const VehicleTypeModal = ({
  isOpen,
  onClose,
  onSubmit: submit,
  vehicleTypes: data,
  isLoading,
  isSubmitLoading,
  onCreate,
  onUpdate,
  onDelete,
}: VehicleTypeModalProps) => {
  const size = useBreakpointValue({ base: "full", md: "5xl" })
  const [deleteData, setDeleteData] = useState<number[] | null>(null)

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setDeleteData(null)
        onClose()
      }}
      size={size}
    >
      <ModalOverlay />
      {isLoading ? (
        <ModalContent>
          <Flex
            alignItems="center"
            width="100%"
            height="60vh"
            justifyContent="center"
          >
            <Center>
              <Spinner size="xl" color="primary.500" />
            </Center>
          </Flex>
        </ModalContent>
      ) : (
        <VehicleTypeForm
          vehicleTypes={data}
          onClose={onClose}
          onSubmit={submit}
          isSubmitLoading={isSubmitLoading}
          onCreate={onCreate}
          onUpdate={onUpdate}
          onDelete={onDelete}
          deleteData={deleteData}
          setDeleteData={setDeleteData}
        />
      )}
    </Modal>
  )
}

export default VehicleTypeModal
