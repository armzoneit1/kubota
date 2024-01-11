import { Text } from "@chakra-ui/react"

const Status = ({ value }: { value: boolean }) => (
  <Text
    backgroundColor={value ? "green" : "gray.500"}
    color="white"
    width="fit-content"
    textAlign="center"
    p="4px"
    textTransform="uppercase"
    fontSize="12px"
    fontWeight={700}
    borderRadius="2px"
  >
    {value ? "active" : "inactive"}
  </Text>
)

export default Status
