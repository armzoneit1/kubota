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
  useBreakpointValue,
  Link,
  Text,
  Button,
} from "@chakra-ui/react"
import { BiLogOut } from "react-icons/bi"
import { AiOutlineUserSwitch,AiOutlineCar } from "react-icons/ai"
import { useMsal } from "@azure/msal-react"
import { authProvider } from "../../../providers/auth-provider"
import NextImage from "next/image"
import NextLink from "next/link"
import { useRouter } from "next/router"
import { useAccountMe } from "../../../providers/account-me-provider"

interface AppbarProps extends FlexProps {
  onOpen: () => void
  sidebarToggle?: () => void
  isOpen?: boolean
}
const Appbar = ({ onOpen, sidebarToggle, isOpen, ...rest }: AppbarProps) => {
  const { instance } = useMsal()
  const router = useRouter()
  const imageLayout:
    | "fixed"
    | "fill"
    | "intrinsic"
    | "responsive"
    | undefined = useBreakpointValue({ base: "intrinsic", md: "fixed" })
  const accountMe = useAccountMe()

  return (
    <Flex
      px={{ base: 4, md: 4 }}
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent={{ base: "space-between", md: "space-between" }}
      width="100%"
      pr={{ base: 0, md: "60px", lg: "60px" }}
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
          mr={{ base: 0, md: "16px", lg: "36px" }}
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
              {accountMe?.planningBusUser !== null &&
                accountMe?.planningBusUser?.status === true && (
                  <NextLink href={`/admin/users`} passHref>
                    <Link _focus={{}} _hover={{}}>
                      <MenuItem
                        icon={<AiOutlineUserSwitch />}
                        _hover={{
                          bg: "#D4E3E3",
                          color: "primary.500",
                          fill: "primary.500",
                          borderRadius: "6px",
                        }}
                        _focus={{}}
                      >
                        ไปส่วน Admin
                      </MenuItem>
                    </Link>
                  </NextLink>
                )}
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
