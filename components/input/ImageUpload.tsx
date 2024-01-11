/* eslint-disable @next/next/no-img-element */
import React, { useCallback, useEffect, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Center, IconButton, Box, HStack, Text, Image } from "@chakra-ui/react"
import { AddIcon, CloseIcon } from "@chakra-ui/icons"
import isEqual from "lodash/isEqual"
import { Controlled as ControlledZoom } from "react-medium-image-zoom"

import "react-medium-image-zoom/dist/styles.css"

const ImageUpload = ({
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
  const [isZoomed, setIsZoomed] = useState(false)

  const handleZoomChange = useCallback((shouldZoom) => {
    setIsZoomed(shouldZoom)
  }, [])

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
      {multiple ? (
        <Center
          {...getRootProps()}
          border="1px solid"
          borderColor="#B2CCCC"
          borderRadius="6px"
          width="150px"
          height="150px"
          cursor="pointer"
        >
          <p>
            <AddIcon />
          </p>
          <input id={name} {...getInputProps()} />
        </Center>
      ) : files.length > 0 ? null : (
        <Center
          {...getRootProps()}
          border="1px solid"
          borderColor="#B2CCCC"
          borderRadius="6px"
          width="150px"
          height="150px"
          cursor="pointer"
        >
          <p>
            <AddIcon />
          </p>
          <input id={name} {...getInputProps()} />
        </Center>
      )}
      <HStack display="flex" flexWrap="wrap">
        {files.map((file) => {
          return (
            <Box
              key={file.name}
              float="left"
              display="inline-block"
              position="relative"
              mr={{ base: 2, md: 4 }}
              border={multiple ? "none" : "1px solid"}
              borderColor={multiple ? "none" : "primary.500"}
              borderRadius={multiple ? "none" : "6px"}
            >
              <IconButton
                aria-label="delete"
                icon={
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM17 13H7V11H17V13Z"
                      fill="#D61212"
                    />
                  </svg>
                }
                onClick={() => {
                  onRemove(file)
                }}
                color="red"
                variant="error"
                top="8px"
                right="15px"
                opacity="0"
                position="absolute"
                minWidth="16px"
                _hover={{ opacity: "1" }}
                zIndex={10}
              />
              <ControlledZoom
                isZoomed={isZoomed}
                onZoomChange={handleZoomChange}
                zoomMargin={50}
              >
                {isZoomed ? (
                  <Image
                    src={
                      file instanceof File ? URL.createObjectURL(file) : file
                    }
                    alt={file.name}
                    borderRadius="6px"
                    h="max-content"
                  />
                ) : (
                  <Image
                    src={
                      file instanceof File ? URL.createObjectURL(file) : file
                    }
                    alt={file.name}
                    borderRadius="6px"
                    h="150px"
                    w="150px"
                  />
                )}
              </ControlledZoom>
            </Box>
          )
        })}
      </HStack>
    </>
  )
}

export default ImageUpload
