import {
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Box,
  LinkBox,
  LinkOverlay,
  Flex,
  Text,
} from "@chakra-ui/react"
import NextLink from "next/link"
import { AccountMeDataTypes } from "../data-hooks/me/types"

type LoginDialog = {
  isOpen: boolean
  onClose: () => void
  accountMe: AccountMeDataTypes | null
}

const LoginDialog = ({ isOpen, onClose, accountMe }: LoginDialog) => {
  return (
    <Modal
      onClose={onClose}
      isOpen={isOpen}
      isCentered
      size="6xl"
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent bgColor="inherit" boxShadow="none">
        <ModalBody>
          <Flex
            flexWrap="wrap"
            width="100%"
            pr={{ base: 0, md: 12 }}
            mb={{ base: 0, md: 10 }}
            alignItems="center"
            justifyContent="center"
          >
            {accountMe &&
              accountMe?.planningBusUser !== null &&
              accountMe?.planningBusUser?.status === true && (
                <LinkBox
                  height="250px"
                  width={{ base: "90%", md: "30%" }}
                  bgColor="#F5F5F5"
                  border="1px solid #B2CCCC"
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  mb={{ base: 4, md: 0 }}
                  cursor="pointer"
                  borderRadius="6px"
                  mr={{ base: 0, md: 12 }}
                >
                  <svg
                    width="116"
                    height="116"
                    viewBox="0 0 116 116"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M54.3268 52.1677C65.8229 52.1677 75.1423 42.8483 75.1423 31.3522C75.1423 19.8561 65.8229 10.5366 54.3268 10.5366C42.8307 10.5366 33.5112 19.8561 33.5112 31.3522C33.5112 42.8483 42.8307 52.1677 54.3268 52.1677Z"
                      fill="#00A5A8"
                    />
                    <path
                      d="M67.6667 90.2222H90.2223V94.7333H67.6667V90.2222Z"
                      fill="#00A5A8"
                    />
                    <path
                      d="M48.3333 96.6666V106.333C48.3333 107.188 48.6728 108.007 49.2771 108.612C49.8814 109.216 50.7009 109.556 51.5555 109.556H106.333C107.188 109.556 108.007 109.216 108.612 108.612C109.216 108.007 109.556 107.188 109.556 106.333V74.1111C109.556 73.2565 109.216 72.4369 108.612 71.8326C108.007 71.2283 107.188 70.8888 106.333 70.8888H83.7777V66.1522C83.7777 65.2976 83.4383 64.478 82.834 63.8737C82.2297 63.2694 81.4101 62.93 80.5555 62.93C79.7009 62.93 78.8814 63.2694 78.2771 63.8737C77.6728 64.478 77.3333 65.2976 77.3333 66.1522V70.8888H70.8889V59.3533C65.4133 58.459 59.8747 58.0064 54.3266 58C42.0912 57.9479 29.9929 60.5765 18.8822 65.7011C17.0535 66.564 15.5108 67.9335 14.4371 69.6469C13.3633 71.3603 12.8036 73.3458 12.8244 75.3677V96.6666H48.3333ZM103.111 103.111H54.7777V77.3333H77.3333V78.6866C77.3333 79.5412 77.6728 80.3608 78.2771 80.9651C78.8814 81.5694 79.7009 81.9088 80.5555 81.9088C81.4101 81.9088 82.2297 81.5694 82.834 80.9651C83.4383 80.3608 83.7777 79.5412 83.7777 78.6866V77.3333H103.111V103.111Z"
                      fill="#00A5A8"
                    />
                  </svg>

                  <NextLink href="/admin/users" passHref>
                    <LinkOverlay
                      _hover={{}}
                      _focus={{ outline: "none" }}
                      _focusVisible={{ outline: "none" }}
                    >
                      <Text
                        fontSize="20px"
                        fontWeight={600}
                        color="primary.500"
                        mt={8}
                      >
                        เเอดมิน
                      </Text>
                    </LinkOverlay>
                  </NextLink>
                </LinkBox>
              )}
            <LinkBox
              height="250px"
              width={{ base: "90%", md: "30%" }}
              bgColor="#F5F5F5"
              border="1px solid #B2CCCC"
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              mb={{ base: 4, md: 0 }}
              cursor="pointer"
              borderRadius="6px"
            >
              <svg
                width="116"
                height="116"
                viewBox="0 0 116 116"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M96.6666 14.5H33.8333V9.66667H29C27.5469 9.82697 26.1587 10.3549 24.9664 11.2005C23.774 12.0462 22.8167 13.1817 22.185 14.5H9.66663V24.1667H18.0283C9.66663 51.1367 9.66663 106.333 9.66663 106.333H33.8333V24.1667H96.6666V14.5ZM106.333 41.0833C106.287 38.808 105.599 36.5919 104.349 34.6902C103.099 32.7885 101.337 31.2785 99.2666 30.3341C97.196 29.3897 94.9007 29.0493 92.6451 29.352C90.3895 29.6548 88.2652 30.5883 86.5169 32.0453C84.7685 33.5023 83.4672 35.4233 82.7627 37.5874C82.0581 39.7514 81.9791 42.0705 82.5346 44.2775C83.0901 46.4844 84.2576 48.4897 85.9027 50.0623C87.5478 51.635 89.6035 52.711 91.8333 53.1667V106.333H96.6666V53.1667C99.437 52.6018 101.922 51.0832 103.688 48.8754C105.454 46.6675 106.39 43.9102 106.333 41.0833ZM72.5 55.5833V77.3333H67.6666V106.333H60.4166V82.1667H55.5833V106.333H48.3333V77.3333H43.5V55.5833C43.5 53.6605 44.2638 51.8165 45.6234 50.4568C46.9831 49.0972 48.8271 48.3333 50.75 48.3333H65.25C67.1728 48.3333 69.0168 49.0972 70.3765 50.4568C71.7361 51.8165 72.5 53.6605 72.5 55.5833ZM58 31.4167C56.566 31.4167 55.1643 31.8419 53.9721 32.6385C52.7798 33.4352 51.8506 34.5675 51.3018 35.8922C50.7531 37.217 50.6095 38.6747 50.8893 40.0811C51.169 41.4874 51.8595 42.7793 52.8734 43.7932C53.8874 44.8071 55.1792 45.4976 56.5856 45.7774C57.9919 46.0571 59.4496 45.9135 60.7744 45.3648C62.0992 44.8161 63.2315 43.8868 64.0281 42.6946C64.8248 41.5023 65.25 40.1006 65.25 38.6667C65.25 36.7439 64.4861 34.8998 63.1265 33.5401C61.7668 32.1805 59.9228 31.4167 58 31.4167Z"
                  fill="#00A5A8"
                />
              </svg>

              <NextLink
                href={
                  accountMe?.bookingBusUser
                    ? "/employee/requests"
                    : "/employee/registration/register"
                }
                passHref
              >
                <LinkOverlay
                  _focus={{ outline: "none" }}
                  _focusVisible={{ outline: "none" }}
                >
                  <Text
                    fontSize="20px"
                    fontWeight={600}
                    color="primary.500"
                    mt={8}
                  >
                    จองรถรับส่งพนักงาน
                  </Text>
                </LinkOverlay>
              </NextLink>
            </LinkBox>
            <LinkBox
              height="250px"
              width={{ base: "90%", md: "30%" }}
              bgColor="#F5F5F5"
              border="1px solid #B2CCCC"
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              mb={{ base: 4, md: 0 }}
              cursor="pointer"
              borderRadius="6px"
              ml={{ base: 0, md: 12 }}
            >
              <svg
                width="116"
                height="116"
                viewBox="0 0 116 116"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M96.6666 14.5H33.8333V9.66667H29C27.5469 9.82697 26.1587 10.3549 24.9664 11.2005C23.774 12.0462 22.8167 13.1817 22.185 14.5H9.66663V24.1667H18.0283C9.66663 51.1367 9.66663 106.333 9.66663 106.333H33.8333V24.1667H96.6666V14.5ZM106.333 41.0833C106.287 38.808 105.599 36.5919 104.349 34.6902C103.099 32.7885 101.337 31.2785 99.2666 30.3341C97.196 29.3897 94.9007 29.0493 92.6451 29.352C90.3895 29.6548 88.2652 30.5883 86.5169 32.0453C84.7685 33.5023 83.4672 35.4233 82.7627 37.5874C82.0581 39.7514 81.9791 42.0705 82.5346 44.2775C83.0901 46.4844 84.2576 48.4897 85.9027 50.0623C87.5478 51.635 89.6035 52.711 91.8333 53.1667V106.333H96.6666V53.1667C99.437 52.6018 101.922 51.0832 103.688 48.8754C105.454 46.6675 106.39 43.9102 106.333 41.0833ZM72.5 55.5833V77.3333H67.6666V106.333H60.4166V82.1667H55.5833V106.333H48.3333V77.3333H43.5V55.5833C43.5 53.6605 44.2638 51.8165 45.6234 50.4568C46.9831 49.0972 48.8271 48.3333 50.75 48.3333H65.25C67.1728 48.3333 69.0168 49.0972 70.3765 50.4568C71.7361 51.8165 72.5 53.6605 72.5 55.5833ZM58 31.4167C56.566 31.4167 55.1643 31.8419 53.9721 32.6385C52.7798 33.4352 51.8506 34.5675 51.3018 35.8922C50.7531 37.217 50.6095 38.6747 50.8893 40.0811C51.169 41.4874 51.8595 42.7793 52.8734 43.7932C53.8874 44.8071 55.1792 45.4976 56.5856 45.7774C57.9919 46.0571 59.4496 45.9135 60.7744 45.3648C62.0992 44.8161 63.2315 43.8868 64.0281 42.6946C64.8248 41.5023 65.25 40.1006 65.25 38.6667C65.25 36.7439 64.4861 34.8998 63.1265 33.5401C61.7668 32.1805 59.9228 31.4167 58 31.4167Z"
                  fill="#00A5A8"
                />
              </svg>

              <NextLink
                href={
                  "/employee2/rentcaralldaydriver"
                }
                passHref
              >
                <LinkOverlay
                  _focus={{ outline: "none" }}
                  _focusVisible={{ outline: "none" }}
                >
                  <Text
                    fontSize="20px"
                    fontWeight={600}
                    color="primary.500"
                    mt={8}
                  >
                    จองรถส่วนกลาง/รถเช่า
                  </Text>
                </LinkOverlay>
              </NextLink>
            </LinkBox>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default LoginDialog
