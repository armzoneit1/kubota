/* eslint-disable react/no-children-prop */
import {
  Flex,
  Text,
  InputGroup,
  InputLeftElement,
  Input,
} from "@chakra-ui/react"
import { SearchIcon } from "@chakra-ui/icons"
import { useForm } from "react-hook-form"
import { useDebouncedCallback } from "use-debounce"

interface ToolbarProps {
  title: string
  showSearchInput?: boolean
  setSearch?: React.Dispatch<React.SetStateAction<string>>
  search?: string
}

const Toolbar = ({
  title,
  showSearchInput = true,
  setSearch,
  search,
}: ToolbarProps) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onChange", defaultValues: { query: search } })

  const debounced = useDebouncedCallback((value) => {
    if (setSearch) setSearch(value)
  }, 500)

  function onSubmit(values: any) {
    debounced(`${values.query}`)
  }

  return (
    <Flex
      justifyContent="space-between"
      mb={{ base: "20px", md: "40px" }}
      flexDirection={{ base: "column", md: "row" }}
    >
      <Text
        fontSize={{ base: "28px", md: "32px" }}
        mb={{ base: 4, md: 0 }}
        fontWeight="600"
      >
        {title}
      </Text>
      {showSearchInput && (
        <form onChange={handleSubmit(onSubmit)}>
          <Flex alignItems="center">
            <InputGroup>
              <InputLeftElement
                pointerEvents="none"
                children={<SearchIcon color="gray.300" />}
              />
              <Input
                id="query"
                placeholder="Search"
                {...register("query")}
                w={{ base: "100%", md: "80" }}
                borderColor="#B2CCCC"
                _focus={{
                  borderColor: "#B2CCCC",
                  boxShadow: "0 0 0 1px #00A5A8",
                }}
              />
            </InputGroup>
          </Flex>
        </form>
      )}
    </Flex>
  )
}

export default Toolbar
