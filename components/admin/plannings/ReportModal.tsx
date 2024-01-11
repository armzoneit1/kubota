import {
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Flex,
  Box,
  Text,
  Table,
  Thead,
  Tbody,
  Th,
  Tr,
  Td,
  useBreakpointValue,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Select,
} from "@chakra-ui/react"
import { useForm, Controller } from "react-hook-form"

type ReportModalProps = {
  isOpen: boolean
  onClose: () => void
  exportEmployeeAnnouncement: (values: any) => void
  exportEmployeeAttendance: (values: any) => void
  exportSummaryBookingResult: (values: any) => void
  exportSummaryBookingResultDetail: (values: any) => void
  exportDaily: (values: any) => void
  isLoadingExportEmployeeAnnouncement: boolean
  isLoadingExportEmployeeAttendance: boolean
  isLoadingSummaryBookingResult: boolean
  isLoadingSummaryBookingResultDetail: boolean
  isLoadingExportDaily: boolean
  date?: string
  scheduleId: string | string[] | undefined
  periodOfDay: "morning" | "evening"
}

const ReportModal = ({
  isOpen,
  onClose,
  exportEmployeeAnnouncement,
  exportEmployeeAttendance,
  exportSummaryBookingResult,
  exportSummaryBookingResultDetail,
  exportDaily,
  isLoadingExportEmployeeAnnouncement,
  isLoadingExportEmployeeAttendance,
  isLoadingSummaryBookingResult,
  isLoadingSummaryBookingResultDetail,
  isLoadingExportDaily,
  date,
  scheduleId,
  periodOfDay,
}: ReportModalProps) => {
  const showButton = useBreakpointValue({ base: true, md: false })

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={"2xl"}>
      <ModalOverlay />
      <ModalContent p={{ base: 2, md: 8 }}>
        <ModalHeader color="primary.500" fontSize="28px" fontWeight={700}>
          รายงาน
        </ModalHeader>
        {showButton && <ModalCloseButton _focus={{ boxShadow: "none" }} />}
        <ModalBody>
          <Table variant="unstyled" mb={8}>
            <Thead>
              <Tr>
                <Th
                  fontSize={{ base: "14px", md: "16px" }}
                  fontWeight={600}
                  color="primary.500"
                  padding={{ base: "10px 14px", md: "12px 24px" }}
                  w="50%"
                ></Th>
                <Th
                  fontSize={{ base: "14px", md: "16px" }}
                  fontWeight={600}
                  color="primary.500"
                  padding={{ base: "10px 14px", md: "12px 24px" }}
                  w="50%"
                ></Th>
              </Tr>
            </Thead>
            <Tbody fontSize={{ base: "14px", md: "16px" }}>
              <Tr>
                <Td padding={{ base: "12px 16px", md: "16px 24px" }} w="50%">
                  สรุปการจัดรถ
                </Td>
                <Td padding={{ base: "12px 16px", md: "16px 24px" }} w="50%">
                  <Button
                    leftIcon={
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2.85902 2.87722L15.429 1.08222C15.5 1.07204 15.5723 1.07723 15.641 1.09744C15.7098 1.11765 15.7734 1.1524 15.8275 1.19935C15.8817 1.24629 15.9251 1.30433 15.9549 1.36952C15.9846 1.43472 16 1.50555 16 1.57722V22.4232C16 22.4948 15.9846 22.5655 15.9549 22.6306C15.9252 22.6957 15.8819 22.7537 15.8279 22.8007C15.7738 22.8476 15.7103 22.8824 15.6417 22.9026C15.5731 22.9229 15.5009 22.9282 15.43 22.9182L2.85802 21.1232C2.61964 21.0893 2.40152 20.9704 2.24371 20.7886C2.08591 20.6067 1.99903 20.374 1.99902 20.1332V3.86722C1.99903 3.62643 2.08591 3.39373 2.24371 3.21186C2.40152 3.02999 2.61964 2.91117 2.85802 2.87722H2.85902ZM17 3.00022H21C21.2652 3.00022 21.5196 3.10557 21.7071 3.29311C21.8947 3.48064 22 3.735 22 4.00022V20.0002C22 20.2654 21.8947 20.5198 21.7071 20.7073C21.5196 20.8949 21.2652 21.0002 21 21.0002H17V3.00022ZM10.2 12.0002L13 8.00022H10.6L9.00002 10.2862L7.40002 8.00022H5.00002L7.80002 12.0002L5.00002 16.0002H7.40002L9.00002 13.7142L10.6 16.0002H13L10.2 12.0002Z"
                          fill="#F9F9F9"
                        />
                      </svg>
                    }
                    _focus={{ boxShadow: "none" }}
                    isLoading={isLoadingSummaryBookingResult}
                    onClick={() => {
                      exportSummaryBookingResult({
                        scheduleId,
                        periodOfDay,
                        date,
                      })
                    }}
                  >
                    ดาวน์โหลดเป็น Excel
                  </Button>
                </Td>
              </Tr>
              <Tr>
                <Td padding={{ base: "12px 16px", md: "16px 24px" }} w="50%">
                  ประกาศสำหรับพนักงาน
                </Td>
                <Td padding={{ base: "12px 16px", md: "16px 24px" }} w="50%">
                  {" "}
                  <Button
                    leftIcon={
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2.85902 2.87722L15.429 1.08222C15.5 1.07204 15.5723 1.07723 15.641 1.09744C15.7098 1.11765 15.7734 1.1524 15.8275 1.19935C15.8817 1.24629 15.9251 1.30433 15.9549 1.36952C15.9846 1.43472 16 1.50555 16 1.57722V22.4232C16 22.4948 15.9846 22.5655 15.9549 22.6306C15.9252 22.6957 15.8819 22.7537 15.8279 22.8007C15.7738 22.8476 15.7103 22.8824 15.6417 22.9026C15.5731 22.9229 15.5009 22.9282 15.43 22.9182L2.85802 21.1232C2.61964 21.0893 2.40152 20.9704 2.24371 20.7886C2.08591 20.6067 1.99903 20.374 1.99902 20.1332V3.86722C1.99903 3.62643 2.08591 3.39373 2.24371 3.21186C2.40152 3.02999 2.61964 2.91117 2.85802 2.87722H2.85902ZM17 3.00022H21C21.2652 3.00022 21.5196 3.10557 21.7071 3.29311C21.8947 3.48064 22 3.735 22 4.00022V20.0002C22 20.2654 21.8947 20.5198 21.7071 20.7073C21.5196 20.8949 21.2652 21.0002 21 21.0002H17V3.00022ZM10.2 12.0002L13 8.00022H10.6L9.00002 10.2862L7.40002 8.00022H5.00002L7.80002 12.0002L5.00002 16.0002H7.40002L9.00002 13.7142L10.6 16.0002H13L10.2 12.0002Z"
                          fill="#F9F9F9"
                        />
                      </svg>
                    }
                    _focus={{ boxShadow: "none" }}
                    isLoading={isLoadingExportEmployeeAnnouncement}
                    onClick={() => {
                      exportEmployeeAnnouncement({
                        scheduleId,
                        periodOfDay,
                        date,
                      })
                    }}
                  >
                    ดาวน์โหลดเป็น Excel
                  </Button>
                </Td>
              </Tr>
              <Tr>
                <Td padding={{ base: "12px 16px", md: "16px 24px" }} w="50%">
                  ใบลงนามของพนักงาน
                </Td>
                <Td padding={{ base: "12px 16px", md: "16px 24px" }} w="50%">
                  {" "}
                  <Button
                    leftIcon={
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2.85902 2.87722L15.429 1.08222C15.5 1.07204 15.5723 1.07723 15.641 1.09744C15.7098 1.11765 15.7734 1.1524 15.8275 1.19935C15.8817 1.24629 15.9251 1.30433 15.9549 1.36952C15.9846 1.43472 16 1.50555 16 1.57722V22.4232C16 22.4948 15.9846 22.5655 15.9549 22.6306C15.9252 22.6957 15.8819 22.7537 15.8279 22.8007C15.7738 22.8476 15.7103 22.8824 15.6417 22.9026C15.5731 22.9229 15.5009 22.9282 15.43 22.9182L2.85802 21.1232C2.61964 21.0893 2.40152 20.9704 2.24371 20.7886C2.08591 20.6067 1.99903 20.374 1.99902 20.1332V3.86722C1.99903 3.62643 2.08591 3.39373 2.24371 3.21186C2.40152 3.02999 2.61964 2.91117 2.85802 2.87722H2.85902ZM17 3.00022H21C21.2652 3.00022 21.5196 3.10557 21.7071 3.29311C21.8947 3.48064 22 3.735 22 4.00022V20.0002C22 20.2654 21.8947 20.5198 21.7071 20.7073C21.5196 20.8949 21.2652 21.0002 21 21.0002H17V3.00022ZM10.2 12.0002L13 8.00022H10.6L9.00002 10.2862L7.40002 8.00022H5.00002L7.80002 12.0002L5.00002 16.0002H7.40002L9.00002 13.7142L10.6 16.0002H13L10.2 12.0002Z"
                          fill="#F9F9F9"
                        />
                      </svg>
                    }
                    _focus={{ boxShadow: "none" }}
                    isLoading={isLoadingExportEmployeeAttendance}
                    onClick={() => {
                      exportEmployeeAttendance({
                        scheduleId,
                        periodOfDay,
                        date,
                      })
                    }}
                  >
                    ดาวน์โหลดเป็น Excel
                  </Button>
                </Td>
              </Tr>
              <Tr>
                <Td padding={{ base: "12px 16px", md: "16px 24px" }} w="50%">
                  จุดจอดรถเพิ่มเติม (นอกเส้นทาง)
                </Td>
                <Td padding={{ base: "12px 16px", md: "16px 24px" }} w="50%">
                  {" "}
                  <Button
                    leftIcon={
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2.85902 2.87722L15.429 1.08222C15.5 1.07204 15.5723 1.07723 15.641 1.09744C15.7098 1.11765 15.7734 1.1524 15.8275 1.19935C15.8817 1.24629 15.9251 1.30433 15.9549 1.36952C15.9846 1.43472 16 1.50555 16 1.57722V22.4232C16 22.4948 15.9846 22.5655 15.9549 22.6306C15.9252 22.6957 15.8819 22.7537 15.8279 22.8007C15.7738 22.8476 15.7103 22.8824 15.6417 22.9026C15.5731 22.9229 15.5009 22.9282 15.43 22.9182L2.85802 21.1232C2.61964 21.0893 2.40152 20.9704 2.24371 20.7886C2.08591 20.6067 1.99903 20.374 1.99902 20.1332V3.86722C1.99903 3.62643 2.08591 3.39373 2.24371 3.21186C2.40152 3.02999 2.61964 2.91117 2.85802 2.87722H2.85902ZM17 3.00022H21C21.2652 3.00022 21.5196 3.10557 21.7071 3.29311C21.8947 3.48064 22 3.735 22 4.00022V20.0002C22 20.2654 21.8947 20.5198 21.7071 20.7073C21.5196 20.8949 21.2652 21.0002 21 21.0002H17V3.00022ZM10.2 12.0002L13 8.00022H10.6L9.00002 10.2862L7.40002 8.00022H5.00002L7.80002 12.0002L5.00002 16.0002H7.40002L9.00002 13.7142L10.6 16.0002H13L10.2 12.0002Z"
                          fill="#F9F9F9"
                        />
                      </svg>
                    }
                    _focus={{ boxShadow: "none" }}
                    isLoading={isLoadingSummaryBookingResultDetail}
                    onClick={() => {
                      exportSummaryBookingResultDetail({
                        scheduleId,
                        periodOfDay,
                        date,
                      })
                    }}
                  >
                    ดาวน์โหลดเป็น Excel
                  </Button>
                </Td>
              </Tr>
              <Tr>
                <Td padding={{ base: "12px 16px", md: "16px 24px" }} w="50%">
                  ตารางรถรับส่งประจำวัน
                </Td>
                <Td padding={{ base: "12px 16px", md: "16px 24px" }} w="50%">
                  {" "}
                  <Button
                    leftIcon={
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2.85902 2.87722L15.429 1.08222C15.5 1.07204 15.5723 1.07723 15.641 1.09744C15.7098 1.11765 15.7734 1.1524 15.8275 1.19935C15.8817 1.24629 15.9251 1.30433 15.9549 1.36952C15.9846 1.43472 16 1.50555 16 1.57722V22.4232C16 22.4948 15.9846 22.5655 15.9549 22.6306C15.9252 22.6957 15.8819 22.7537 15.8279 22.8007C15.7738 22.8476 15.7103 22.8824 15.6417 22.9026C15.5731 22.9229 15.5009 22.9282 15.43 22.9182L2.85802 21.1232C2.61964 21.0893 2.40152 20.9704 2.24371 20.7886C2.08591 20.6067 1.99903 20.374 1.99902 20.1332V3.86722C1.99903 3.62643 2.08591 3.39373 2.24371 3.21186C2.40152 3.02999 2.61964 2.91117 2.85802 2.87722H2.85902ZM17 3.00022H21C21.2652 3.00022 21.5196 3.10557 21.7071 3.29311C21.8947 3.48064 22 3.735 22 4.00022V20.0002C22 20.2654 21.8947 20.5198 21.7071 20.7073C21.5196 20.8949 21.2652 21.0002 21 21.0002H17V3.00022ZM10.2 12.0002L13 8.00022H10.6L9.00002 10.2862L7.40002 8.00022H5.00002L7.80002 12.0002L5.00002 16.0002H7.40002L9.00002 13.7142L10.6 16.0002H13L10.2 12.0002Z"
                          fill="#F9F9F9"
                        />
                      </svg>
                    }
                    _focus={{ boxShadow: "none" }}
                    isLoading={isLoadingExportDaily}
                    onClick={() => {
                      exportDaily({
                        scheduleId,
                        periodOfDay,
                        date,
                      })
                    }}
                  >
                    ดาวน์โหลดเป็น Excel
                  </Button>
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </ModalBody>
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
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default ReportModal
