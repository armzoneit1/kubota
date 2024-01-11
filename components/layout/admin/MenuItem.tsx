import React from "react"

import { Flex, Icon, FlexProps, Link, Tooltip } from "@chakra-ui/react"
import { IconType } from "react-icons"
import { ReactText } from "react"
import NextLink from "next/link"
import { useRouter } from "next/router"

interface MenuItemProps extends FlexProps {
  icon: IconType
  children: ReactText
  link: string
  isOpen?: boolean
  mobileSize?: boolean
  onClose: () => void
}
const MenuItem = ({
  icon,
  link,
  children,
  isOpen,
  onClose,
  mobileSize,
  ...rest
}: MenuItemProps) => {
  const router = useRouter()
  const path = `${router.pathname}`.split("/")

  return (
    <NextLink
      passHref
      href={
        mobileSize
          ? link === "/admin/timeTables" || link === "/admin/busLines"
            ? `${link}/morning`
            : link
          : link === "/admin/timeTables" || link === "/admin/busLines"
          ? `${link}/morning`
          : link
      }
    >
      <Link
        _hover={{}}
        _focus={{}}
        onClick={() => {
          if (mobileSize) {
            onClose()
          }
        }}
      >
        <Flex
          align="center"
          p={isOpen ? "4" : "2"}
          mx="4"
          borderRadius="lg"
          role="group"
          cursor="pointer"
          _hover={{
            bg: "#D4E3E3",
            color: "primary.500",
            fill: "primary.500",
          }}
          color={`${
            `/${path[1]}/${path[2]}` === link ? "primary.500" : "none"
          }`}
          fill={`${`/${path[1]}/${path[2]}` === link ? "primary.500" : "none"}`}
          overflow="hidden"
          textDecoration="none"
          {...rest}
        >
          {icon ? (
            isOpen ? (
              <Icon
                mr="4"
                fontSize="20"
                _groupHover={{
                  color: "primary.500",
                }}
                as={icon}
              />
            ) : (
              <Tooltip label={children}>
                <Icon
                  mr="4"
                  fontSize="20"
                  _groupHover={{
                    color: "primary.500",
                  }}
                  as={icon}
                />
              </Tooltip>
            )
          ) : null}
          {isOpen && children}
        </Flex>
      </Link>
    </NextLink>
  )
}

export default MenuItem
