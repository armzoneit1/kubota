import React from "react"
import {
  IconButton,
  Box,
  Flex,
  HStack,
  useColorModeValue,
  FlexProps,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  Text,
  Button,
  Divider,
  useBreakpointValue,
  Link,
  Center,
  Spinner,
} from "@chakra-ui/react"
import { BiLogOut } from "react-icons/bi"
import { AiOutlineCar } from "react-icons/ai"
import { useMsal } from "@azure/msal-react"
import { authProvider } from "../../../providers/auth-provider"
import NextImage from "next/image"
import NextLink from "next/link"
import { NotificationDataTypes } from "../../../data-hooks/notifications/types"
import get from "lodash/get"
import filter from "lodash/filter"
import { DateTime } from "luxon"
import styles from "../layout.module.css"
import { useAccountMe } from "../../../providers/account-me-provider"

enum NoticationTypes {
  maxDriverAge = "คนขับอายุครบกำหนด",
  maxVehicleAge = "รถอายุครบกำหนด",
  driverLicenseExpired = "ใบขับขี่หมดอายุ",
  insuranceExpired = "ครบรอบกำหนดประกันภัย",
  taxExpired = "ครบรอบกำหนดภาษี",
  actExpired = "ครบรอบกำหนดประกันภัย",
}

interface AppbarProps extends FlexProps {
  onOpen: () => void
  sidebarToggle?: () => void
  isOpen?: boolean
  notifications: NotificationDataTypes[]
  isLoadingNotification: boolean
  update: (values: any) => void
  isLoadingUpdate: boolean
}
const Appbar = ({
  onOpen,
  sidebarToggle,
  isOpen,
  notifications,
  isLoadingNotification,
  update,
  isLoadingUpdate,
  ...rest
}: AppbarProps) => {
  const { instance } = useMsal()
  const today = DateTime.fromJSDate(new Date()).toISO()
  const end = DateTime.fromISO(today)
  const imageLayout:
    | "fixed"
    | "fill"
    | "intrinsic"
    | "responsive"
    | undefined = useBreakpointValue({ base: "intrinsic", md: "fixed" })
  const accountMe = useAccountMe()

  return (
    <Flex
      p={{ base: "0px 16px 0px 16px", md: "0px 28px 0px 16px" }}
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent={{ base: "space-between", md: "space-between" }}
      width="100%"
      {...rest}
    >
      <Box display={{ base: "none", md: "flex" }} alignItems="center">
        <IconButton
          display={{ base: "none", md: "flex" }}
          _focus={{ boxShadow: "none" }}
          onClick={sidebarToggle}
          variant="ghost"
          aria-label="open menu"
          icon={
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22 18.005C22 18.555 21.554 19 21.005 19L12.995 19C12.7311 19 12.478 18.8952 12.2914 18.7086C12.1048 18.522 12 18.2689 12 18.005C12 17.7411 12.1048 17.488 12.2914 17.3014C12.478 17.1148 12.7311 17.01 12.995 17.01L21.005 17.01C21.2689 17.01 21.522 17.1148 21.7086 17.3014C21.8952 17.488 22 17.7411 22 18.005Z"
                fill="#333333"
              />
              <path
                d="M22 12.0001C22 12.5501 21.554 12.9951 21.005 12.9951L2.995 12.9951C2.73111 12.9951 2.47803 12.8903 2.29143 12.7037C2.10483 12.5171 2 12.264 2 12.0001C2 11.7362 2.10483 11.4831 2.29143 11.2965C2.47803 11.1099 2.73111 11.0051 2.995 11.0051L21.005 11.0051C21.2689 11.0051 21.522 11.1099 21.7086 11.2965C21.8952 11.4831 22 11.7362 22 12.0001Z"
                fill="#333333"
              />
              <path
                d="M21.005 6.99023C21.2689 6.99023 21.522 6.88541 21.7086 6.69881C21.8952 6.51221 22 6.25913 22 5.99524C22 5.73135 21.8952 5.47826 21.7086 5.29166C21.522 5.10507 21.2689 5.00023 21.005 5.00023L8.995 5.00023C8.73111 5.00023 8.47803 5.10506 8.29143 5.29166C8.10483 5.47826 8 5.73134 8 5.99523C8 6.25912 8.10483 6.51221 8.29143 6.69881C8.47803 6.8854 8.73111 6.99023 8.995 6.99023L21.005 6.99023Z"
                fill="#333333"
              />
            </svg>
          }
          mr={{ base: 0, md: "22px", lg: "42px" }}
        />
        <NextImage
          src="/assets/image/kubota-logo.png"
          alt="logo"
          height={51}
          width={128}
          layout={imageLayout}
        />
      </Box>

      <Box display={{ base: "flex", md: "none" }} alignItems="center">
        <IconButton
          display={{ base: "flex", md: "none" }}
          _focus={{ boxShadow: "none" }}
          onClick={onOpen}
          variant="ghost"
          aria-label="open menu"
          paddingInlineStart={0}
          paddingInlineEnd={0}
          justifyContent="flex-start"
          icon={
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22 18.005C22 18.555 21.554 19 21.005 19L12.995 19C12.7311 19 12.478 18.8952 12.2914 18.7086C12.1048 18.522 12 18.2689 12 18.005C12 17.7411 12.1048 17.488 12.2914 17.3014C12.478 17.1148 12.7311 17.01 12.995 17.01L21.005 17.01C21.2689 17.01 21.522 17.1148 21.7086 17.3014C21.8952 17.488 22 17.7411 22 18.005Z"
                fill="#333333"
              />
              <path
                d="M22 12.0001C22 12.5501 21.554 12.9951 21.005 12.9951L2.995 12.9951C2.73111 12.9951 2.47803 12.8903 2.29143 12.7037C2.10483 12.5171 2 12.264 2 12.0001C2 11.7362 2.10483 11.4831 2.29143 11.2965C2.47803 11.1099 2.73111 11.0051 2.995 11.0051L21.005 11.0051C21.2689 11.0051 21.522 11.1099 21.7086 11.2965C21.8952 11.4831 22 11.7362 22 12.0001Z"
                fill="#333333"
              />
              <path
                d="M21.005 6.99023C21.2689 6.99023 21.522 6.88541 21.7086 6.69881C21.8952 6.51221 22 6.25913 22 5.99524C22 5.73135 21.8952 5.47826 21.7086 5.29166C21.522 5.10507 21.2689 5.00023 21.005 5.00023L8.995 5.00023C8.73111 5.00023 8.47803 5.10506 8.29143 5.29166C8.10483 5.47826 8 5.73134 8 5.99523C8 6.25912 8.10483 6.51221 8.29143 6.69881C8.47803 6.8854 8.73111 6.99023 8.995 6.99023L21.005 6.99023Z"
                fill="#333333"
              />
            </svg>
          }
        />
        <NextImage
          src="/assets/image/kubota-logo.png"
          alt="logo"
          height={51}
          width={128}
          layout={imageLayout}
        />
      </Box>
      <HStack spacing={{ base: "0", md: "6" }}>
        <Popover placement="bottom-start">
          {({ isOpen, onClose }) => (
            <>
              <PopoverTrigger>
                {isLoadingNotification ? (
                  <Flex
                    alignItems="center"
                    width="100%"
                    height="100%"
                    justifyContent="center"
                  >
                    <Center>
                      <Spinner color="primary.500" />
                    </Center>
                  </Flex>
                ) : (
                  <Box>
                    <IconButton
                      variant="ghost"
                      aria-label="open menu"
                      fill="primary.500"
                      color="primary.500"
                      _focus={{ boxShadow: "none" }}
                      icon={
                        filter(notifications, { isComplete: false }).length >
                        0 ? (
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 32 32"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M15.9997 29.3337C15.2923 29.3302 14.6146 29.0485 14.1132 28.5496C13.6117 28.0506 13.3267 27.3744 13.3197 26.667H18.653C18.6558 27.0235 18.5878 27.377 18.453 27.707C18.2806 28.1026 18.0166 28.4516 17.6827 28.7252C17.3489 28.9988 16.9548 29.189 16.533 29.2803H16.4703C16.3154 29.3126 16.1579 29.3305 15.9997 29.3337ZM26.6663 25.3337H5.33301V22.667L7.99967 21.3337V14.0003C7.92943 12.1192 8.35426 10.2525 9.23167 8.58699C9.66346 7.82335 10.2522 7.15994 10.9592 6.64052C11.6662 6.1211 12.4752 5.75749 13.333 5.57366V2.66699H18.6663V5.57366C22.105 6.39233 23.9997 9.38433 23.9997 14.0003V21.3337L26.6663 22.667V25.3337Z"
                              fill="#00A5A8"
                            />
                            <circle cx="23" cy="6" r="5" fill="#D61212" />
                          </svg>
                        ) : (
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 32 32"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M15.9997 29.3337C15.2923 29.3302 14.6146 29.0485 14.1132 28.5496C13.6117 28.0506 13.3267 27.3744 13.3197 26.667H18.653C18.6558 27.0235 18.5878 27.377 18.453 27.707C18.2806 28.1026 18.0166 28.4516 17.6827 28.7252C17.3489 28.9988 16.9548 29.189 16.533 29.2803H16.4703C16.3154 29.3126 16.1579 29.3305 15.9997 29.3337ZM26.6663 25.3337H5.33301V22.667L7.99967 21.3337V14.0003C7.92943 12.1192 8.35426 10.2525 9.23167 8.58699C9.66346 7.82335 10.2522 7.15994 10.9592 6.64052C11.6662 6.1211 12.4752 5.75749 13.333 5.57366V2.66699H18.6663V5.57366C22.105 6.39233 23.9997 9.38433 23.9997 14.0003V21.3337L26.6663 22.667V25.3337Z"
                              fill="#00A5A8"
                            />
                          </svg>
                        )
                      }
                    />
                  </Box>
                )}
              </PopoverTrigger>
              <PopoverContent
                bg="white"
                color="black"
                transform="tre"
                p="24px"
                borderColor="primary.500"
                _focus={{ outline: "none" }}
                maxHeight="60vh"
                overflowY="scroll"
                className={styles.scroll}
              >
                <Text fontSize="12px" color="primary.500" fontWeight={700}>
                  การแจ้งเตือน
                </Text>
                {notifications && notifications.length > 0 ? (
                  notifications.map((notification, index) => {
                    const start = DateTime.fromISO(
                      notification.notificationDate
                    )

                    const diff = end.diff(start, [
                      "years",
                      "months",
                      "days",
                      "hours",
                      "minutes",
                    ])

                    const years = diff.toObject()?.years
                    const months = diff.toObject()?.months
                    const days = diff.toObject()?.days
                    const hours = diff.toObject()?.hours
                    const minutes = diff.toObject()?.minutes

                    let timeDuration = ""
                    if (years && years > 0) {
                      timeDuration = `${years} ปีที่เเล้ว`
                    } else if (months && months > 0) {
                      timeDuration = `${months} เดือนที่เเล้ว`
                    } else if (days && days > 0) {
                      timeDuration = `${days} วันที่เเล้ว`
                    } else if (hours) {
                      timeDuration = `${hours} ชั่วโมงที่เเล้ว`
                    } else if (minutes) {
                      timeDuration = `${Math.floor(minutes)} นาทีที่แล้ว`
                    }

                    return (
                      <>
                        <PopoverHeader
                          display="flex"
                          justifyContent="space-between"
                          fontWeight={600}
                          px={0}
                          borderBottomWidth={0}
                          key={notification.id}
                        >
                          <Text>
                            {get(
                              NoticationTypes,
                              `${notification?.notificationType}`
                            )}
                          </Text>
                          <Text
                            fontSize="12px"
                            fontWeight={300}
                            fontStyle="italic"
                          >
                            {timeDuration}
                          </Text>
                        </PopoverHeader>
                        <PopoverBody fontSize="12px" px={0}>
                          {notification.detail}
                          <Flex justifyContent="flex-end">
                            <NextLink
                              passHref
                              href={
                                notification?.notificationType ===
                                  "maxDriverAge" ||
                                notification?.notificationType ===
                                  "driverLicenseExpired"
                                  ? `/admin/transportationProviders/${notification?.transportationProviderId}/drivers/${notification?.driverId}`
                                  : `/admin/transportationProviders/${notification?.transportationProviderId}/vehicles/${notification?.vehicleId}`
                              }
                            >
                              <Link _hover={{}} _focus={{}}>
                                <Button
                                  variant="ghost"
                                  _focus={{ boxShadow: "none" }}
                                  onClick={() => {
                                    setTimeout(() => {
                                      onClose()
                                    }, 250)
                                  }}
                                >
                                  ดูรายละเอียด
                                </Button>
                              </Link>
                            </NextLink>
                            <Button
                              variant="ghost"
                              _focus={{ boxShadow: "none" }}
                              onClick={() => {
                                update({ notificationId: notification?.id })
                                onClose()
                              }}
                              px={0}
                            >
                              เสร็จสิ้น
                            </Button>
                          </Flex>
                        </PopoverBody>
                        {index !== notifications.length - 1 && (
                          <Divider borderColor="#33333360%" />
                        )}
                      </>
                    )
                  })
                ) : (
                  <PopoverBody
                    fontSize="16px"
                    px={0}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Text>ไม่มีข้อความเเจ้งเตือน</Text>
                  </PopoverBody>
                )}
              </PopoverContent>
            </>
          )}
        </Popover>
        <Flex alignItems={"center"}>
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: "none" }}
              as={Button}
              leftIcon={
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M26.749 24.9303C28.1851 23.2024 29.184 21.154 29.661 18.9585C30.1381 16.7629 30.0793 14.4848 29.4897 12.3167C28.9001 10.1487 27.797 8.15453 26.2737 6.50298C24.7504 4.85143 22.8517 3.59106 20.7383 2.82849C18.6248 2.06592 16.3589 1.82358 14.132 2.12198C11.9051 2.42038 9.78282 3.25074 7.94472 4.54281C6.10662 5.83488 4.60675 7.55065 3.57199 9.54498C2.53724 11.5393 1.99804 13.7535 2.00001 16.0003C2.00076 19.2665 3.15175 22.4281 5.25101 24.9303L5.23101 24.9473C5.30101 25.0313 5.38101 25.1033 5.45301 25.1863C5.54301 25.2893 5.64001 25.3863 5.73301 25.4863C6.01301 25.7903 6.30101 26.0823 6.60301 26.3563C6.69501 26.4403 6.79001 26.5183 6.88301 26.5983C7.20301 26.8743 7.53201 27.1363 7.87301 27.3803C7.91701 27.4103 7.95701 27.4493 8.00101 27.4803V27.4683C10.3431 29.1165 13.1371 30.001 16.001 30.001C18.8649 30.001 21.6589 29.1165 24.001 27.4683V27.4803C24.045 27.4493 24.084 27.4103 24.129 27.3803C24.469 27.1353 24.799 26.8743 25.119 26.5983C25.212 26.5183 25.307 26.4393 25.399 26.3563C25.701 26.0813 25.989 25.7903 26.269 25.4863C26.362 25.3863 26.458 25.2893 26.549 25.1863C26.62 25.1033 26.701 25.0313 26.771 24.9463L26.749 24.9303ZM16 8.0003C16.89 8.0003 17.7601 8.26422 18.5001 8.75869C19.2401 9.25316 19.8169 9.95596 20.1575 10.7782C20.4981 11.6005 20.5872 12.5053 20.4135 13.3782C20.2399 14.2511 19.8113 15.0529 19.182 15.6823C18.5527 16.3116 17.7508 16.7402 16.8779 16.9138C16.005 17.0875 15.1002 16.9984 14.2779 16.6578C13.4557 16.3172 12.7529 15.7404 12.2584 15.0004C11.7639 14.2603 11.5 13.3903 11.5 12.5003C11.5 11.3068 11.9741 10.1622 12.818 9.31832C13.6619 8.47441 14.8065 8.0003 16 8.0003ZM8.00701 24.9303C8.02435 23.6173 8.55795 22.3639 9.49236 21.4412C10.4268 20.5186 11.6869 20.001 13 20.0003H19C20.3132 20.001 21.5732 20.5186 22.5076 21.4412C23.4421 22.3639 23.9757 23.6173 23.993 24.9303C21.7998 26.9066 18.9523 28.0004 16 28.0004C13.0477 28.0004 10.2002 26.9066 8.00701 24.9303Z"
                    fill="#00A5A8"
                  />
                </svg>
              }
              variant="text"
              paddingInlineStart={0}
              paddingInlineEnd={0}
            >
              <Text
                fontWeight={400}
              >{`${accountMe?.myHrEmployee?.firstName} ${accountMe?.myHrEmployee?.lastName}`}</Text>
            </MenuButton>
            <MenuList
              bg={useColorModeValue("white", "gray.900")}
              borderColor="#B2CCCC"
              p="6px"
              borderRadius="6px"
            >
              <NextLink
                href={
                  accountMe?.bookingBusUser
                    ? "/employee/requests"
                    : "/employee/registration/register"
                }
                passHref
              >
                <Link _focus={{}} _hover={{}}>
                  <MenuItem
                    icon={
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M16.668 2.49935H5.83464V1.66602H5.0013C4.75078 1.69365 4.51144 1.78467 4.30585 1.93047C4.10027 2.07628 3.93523 2.27206 3.8263 2.49935H1.66797V4.16602H3.10964C1.66797 8.81602 1.66797 18.3327 1.66797 18.3327H5.83464V4.16602H16.668V2.49935ZM18.3346 7.08268C18.3267 6.69038 18.2081 6.30829 17.9926 5.98041C17.777 5.65253 17.4732 5.39219 17.1162 5.22937C16.7592 5.06654 16.3635 5.00785 15.9746 5.06004C15.5857 5.11224 15.2195 5.2732 14.918 5.5244C14.6166 5.7756 14.3922 6.10682 14.2707 6.47993C14.1493 6.85304 14.1356 7.25287 14.2314 7.63339C14.3272 8.01391 14.5285 8.35964 14.8121 8.63078C15.0958 8.90193 15.4502 9.08746 15.8346 9.16602V18.3327H16.668V9.16602C17.1456 9.06862 17.574 8.8068 17.8785 8.42614C18.1831 8.04547 18.3445 7.57007 18.3346 7.08268ZM12.5013 9.58268V13.3327H11.668V18.3327H10.418V14.166H9.58464V18.3327H8.33464V13.3327H7.5013V9.58268C7.5013 9.25116 7.633 8.93322 7.86742 8.6988C8.10184 8.46438 8.41978 8.33268 8.7513 8.33268H11.2513C11.5828 8.33268 11.9008 8.46438 12.1352 8.6988C12.3696 8.93322 12.5013 9.25116 12.5013 9.58268ZM10.0013 5.41602C9.75408 5.41602 9.5124 5.48933 9.30684 5.62668C9.10128 5.76403 8.94106 5.95925 8.84645 6.18766C8.75184 6.41607 8.72709 6.6674 8.77532 6.90988C8.82355 7.15236 8.9426 7.37508 9.11742 7.5499C9.29223 7.72472 9.51496 7.84377 9.75744 7.892C9.99992 7.94023 10.2512 7.91547 10.4797 7.82087C10.7081 7.72626 10.9033 7.56604 11.0406 7.36048C11.178 7.15492 11.2513 6.91324 11.2513 6.66602C11.2513 6.3345 11.1196 6.01655 10.8852 5.78213C10.6508 5.54771 10.3328 5.41602 10.0013 5.41602Z"
                          fill="currentColor"
                        />
                      </svg>
                    }
                    _hover={{
                      bg: "#D4E3E3",
                      color: "primary.500",
                      fill: "primary.500",
                      borderRadius: "6px",
                    }}
                    _focus={{}}
                  >
                    ไปส่วนการจอง
                  </MenuItem>
                </Link>
              </NextLink>
              <NextLink href={`/employee2`} passHref>
                    <Link _focus={{}} _hover={{}}>
                      <MenuItem
                        icon={<AiOutlineCar />}
                        _hover={{
                          bg: "#D4E3E3",
                          color: "primary.500",
                          fill: "primary.500",
                          borderRadius: "6px",
                        }}
                        _focus={{}}
                      >
                        จองรถส่วนกลาง/เช่าเหมาวัน
                      </MenuItem>
                    </Link>
                  </NextLink>
              <MenuItem
                icon={<BiLogOut />}
                onClick={() => authProvider.logout(instance)}
                _hover={{
                  bg: "#D4E3E3",
                  color: "primary.500",
                  fill: "primary.500",
                  borderRadius: "6px",
                }}
                _focus={{}}
              >
                ออกจากระบบ
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  )
}

export default Appbar
