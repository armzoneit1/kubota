import React from "react"
import { Box, Flex, useColorModeValue, FlexProps, Text } from "@chakra-ui/react"

interface FooterProps extends FlexProps {}
const Footer = ({ ...rest }: FooterProps) => {
  const currentYear = new Date().getFullYear()
  return (
    <Flex
      px={{ base: 4, md: 4 }}
      alignItems="center"
      bg="#B2CCCC"
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent="center"
      width="full"
      height="57px"
      {...rest}
    >
      <Box>
        <Text
          fontWeight={300}
          color="#F9F9F9"
          fontSize={{ base: "12px", md: "16px" }}
        >
          {`© ${currentYear} KUBOTA Shuttle Bus Booking . All rights reserved.`}
        </Text>
      </Box>
    </Flex>
  )
}

export default Footer
