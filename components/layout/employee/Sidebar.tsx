import React from "react"
import {
  Box,
  CloseButton,
  Flex,
  useColorModeValue,
  Text,
  BoxProps,
} from "@chakra-ui/react"
import { IconType } from "react-icons"
import { UserIcon, EmployeeIcon, CarBookingIcon, ReportIcon } from "../../Icon"
import MenuItem from "./MenuItem"
import { useAccountMe } from "../../../providers/account-me-provider"

interface LinkItemProps {
  name: string
  icon: IconType | any
  link?: string
}
const LinkItems: Array<LinkItemProps> = [
  { name: "ข้อมูลลงทะเบียน", icon: UserIcon, link: "/employee/registration" },
  {
    name: "จองรถ",
    icon: CarBookingIcon,
    link: "/employee/requests",
  },
  {
    name: "พนักงานในความดูแล",
    icon: EmployeeIcon,
    link: "/employee/subordinates",
  },
  {
    name: "รายงาน",
    icon: ReportIcon,
    link: "/employee/reports",
  },
]

interface SidebarProps extends BoxProps {
  onClose: () => void
  onOpen?: () => void
  isOpen?: boolean
  mobileSize?: boolean
}

const Sidebar = ({
  onClose,
  onOpen,
  isOpen,
  mobileSize,
  ...rest
}: SidebarProps) => {
  const accountMe = useAccountMe()
  LinkItems[0].link =
    accountMe?.bookingBusUser !== null
      ? `/employee/registration/update`
      : `/employee/registration/register`
  return (
    <Box
      transition="width .3s ease"
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: isOpen ? "64" : 16 }}
      minHeight="100%"
      overflowY={mobileSize ? "auto" : "inherit"}
      {...rest}
    >
      <Flex
        h={"20"}
        alignItems="center"
        mx="8"
        justifyContent={isOpen ? "space-between" : "space-around"}
      >
        <Text fontSize="16px" fontFamily="monospace" fontWeight={700}>
          Menu
        </Text>

        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>

      {LinkItems.map((link) => (
        <MenuItem
          key={link.name}
          icon={link.icon}
          link={`${link.link}`}
          isOpen={isOpen}
          w={{ base: "90%", md: isOpen ? 56 : "36px" }}
          my={isOpen ? 0 : 4}
          mobileSize={mobileSize}
          onClose={onClose}
        >
          {link.name}
        </MenuItem>
      ))}
    </Box>
  )
}

export default Sidebar
