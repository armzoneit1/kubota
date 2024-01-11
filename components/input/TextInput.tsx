import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
} from "@chakra-ui/react"
import {} from "react-hook-form"

const TextInput = ({
  errors,
  label,
  colorLabel,
  name,
  register,
  validation,
  fontWeightLabel,
  ...rest
}: any) => {
  return (
    <FormControl isInvalid={!!errors[name]}>
      {label !== null && (
        <FormLabel
          htmlFor={name}
          color={colorLabel}
          fontWeight={
            fontWeightLabel ? fontWeightLabel : colorLabel ? 600 : 400
          }
        >
          {label}
        </FormLabel>
      )}
      <Input
        id={name}
        borderColor="#B2CCCC"
        _focus={{
          borderColor: "#B2CCCC",
          boxShadow: "0 0 0 1px #00A5A8",
        }}
        {...register(name, validation)}
        {...rest}
      />
      <FormErrorMessage>
        {errors[name] && errors[name].message}
      </FormErrorMessage>
    </FormControl>
  )
}

export default TextInput
