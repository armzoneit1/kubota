/* eslint-disable @next/next/no-img-element */
import React, { useEffect } from "react"
import { useDropzone } from "react-dropzone"
import {
  IconButton,
  Box,
  Flex,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react"
import { MdMoreVert } from "react-icons/md"
import isEqual from "lodash/isEqual"

const FileUpload = ({
  setValue,
  register,
  unregister,
  name,
  value,
  multiple = false,
  accept,
  options,
  maxSize,
  minSize,
  label,
  validation,
}: any) => {
  const files = value ? (Array.isArray(value) ? value : [value]) : []

  useEffect(() => {
    register(name, validation)
    return () => {
      unregister(name)
    }
  }, [register, unregister, name, validation])

  const onRemove = (file: any) => {
    if (multiple) {
      const filteredFiles = files.filter(
        (stateFile) => !isEqual(stateFile, file)
      )
      setValue(name, filteredFiles as any)
    } else {
      setValue(name, null)
    }

    if (options?.onRemove) {
      options.onRemove(file)
    }
  }

  const { getRootProps, getInputProps } = useDropzone({
    ...options,
    onDrop: (acceptedFiles) => {
      const updatedFiles = multiple
        ? [...files, ...acceptedFiles]
        : [...acceptedFiles]

      if (multiple) {
        setValue(name, updatedFiles)
      } else {
        setValue(name, [updatedFiles[0]])
      }
    },
    accept,
    maxSize,
    minSize,
    multiple,
  })

  return (
    <>
      <Text mb={4}>{label}</Text>
      <Flex display="flex" flexDirection="column" mb={4}>
        {files.map((file) => {
          return (
            <Box
              key={file.name}
              width={{ base: "100%", md: "80%", xl: "50%" }}
              display="flex"
              alignItems="center"
              mb={2}
            >
              <Text
                wordBreak="break-all"
                mr={{ base: 2, md: 4 }}
                color="#0F99D4"
                textDecoration="underline"
                onClick={
                  file instanceof File
                    ? () => null
                    : () => {
                        window.open(`${file?.documentUrl}`)
                      }
                }
                cursor={file instanceof File ? "inherit" : "pointer"}
              >
                {decodeURIComponent(file?.name)}
              </Text>
              <Menu>
                <MenuButton
                  as={IconButton}
                  icon={<MdMoreVert />}
                  variant="ghost"
                  fontSize="20px"
                  color="#333333"
                  _focus={{ boxShadow: "none" }}
                />
                <MenuList
                  borderColor="#B2CCCC"
                  borderRadius="6px"
                  p="8px"
                  minWidth="150px"
                >
                  <MenuItem
                    _hover={{
                      bgColor: "#D4E3E3",
                      borderRadius: "6px",
                    }}
                    _active={{ background: "none" }}
                    _focus={{ background: "none" }}
                    onClick={() => {
                      onRemove(file)
                    }}
                  >
                    ลบ
                  </MenuItem>
                </MenuList>
              </Menu>
            </Box>
          )
        })}
      </Flex>
      <Text
        color="primary.500"
        textDecoration="underline"
        cursor="pointer"
        {...getRootProps()}
      >
        Upload Document
        <input id={name} {...getInputProps()} />
      </Text>
    </>
  )
}

export default FileUpload
