import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  ModalProps,
  Button,
  useTheme,
  useBreakpointValue,
} from "@chakra-ui/react"

interface ConfirmDialogProps {
  type?: "error" | "primary"
  isOpen: boolean
  id?: string
  onClose(): void
  title: string
  content: any
  acceptLabel?: string
  onSubmit?: () => void
  isLoading?: boolean
  size?: any
}

const ConfirmDialog = ({
  isOpen,
  onClose,
  type = "primary",
  title,
  content,
  acceptLabel = "ยืนยัน",
  onSubmit = () => null,
  isLoading,
  size = "xl",
}: ConfirmDialogProps) => {
  const theme = useTheme()
  const color = type && theme.colors[type]?.["500"]
  const isShow = useBreakpointValue({ base: true, md: false })

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size={size}>
      <ModalOverlay />
      <ModalContent p={5} border="1px solid #B2CCCC">
        <ModalHeader color="#333333">{title}</ModalHeader>
        {isShow && <ModalCloseButton _focus={{ boxShadow: "none" }} />}
        <ModalBody mb={16}>{content}</ModalBody>
        <ModalFooter>
          <Button
            variant="ghost"
            color="#333333"
            onClick={onClose}
            mr={3}
            _focus={{ boxShadow: "none" }}
          >
            ยกเลิก
          </Button>
          <Button
            colorScheme={type}
            _focus={{ boxShadow: "none" }}
            onClick={onSubmit}
            minW="64px"
            isLoading={isLoading}
          >
            {acceptLabel}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default ConfirmDialog
