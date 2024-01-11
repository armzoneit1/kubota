/* eslint-disable react/no-children-prop */
import DatePicker from "react-datepicker"
import { getYear, getMonth } from "date-fns"
import th from "date-fns/locale/th"
import { forwardRef, useState } from "react"
import {
  InputGroup,
  InputRightElement,
  Input,
  Flex,
  Button,
  IconButton,
  Text,
  FormControl,
  FormErrorMessage,
  InputLeftElement,
} from "@chakra-ui/react"
import { AiFillCloseCircle } from "react-icons/ai"

const CustomInput = forwardRef(
  (
    {
      value,
      onClick,
      onChange,
      fieldState,
      onReset,
      // setPrevDate,
      date,
      ...rest
    }: any,
    ref
  ) => {
    return (
      <FormControl isInvalid={fieldState?.invalid}>
        <InputGroup>
          {rest.readOnly ? (
            value ? (
              <InputRightElement
                children={<AiFillCloseCircle fill="#00A5A8" />}
                onClick={onReset}
              />
            ) : (
              <InputRightElement
                cursor="pointer"
                onClick={onClick}
                children={
                  <>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6C21 5.46957 20.7893 4.96086 20.4142 4.58579C20.0391 4.21071 19.5304 4 19 4H17V2H15V4H9V2H7V4H5C4.46957 4 3.96086 4.21071 3.58579 4.58579C3.21071 4.96086 3 5.46957 3 6ZM19 20H5V8H19V20Z"
                        fill="#333333"
                      />
                    </svg>
                  </>
                }
              />
            )
          ) : (
            <InputRightElement
              cursor="pointer"
              onClick={onClick}
              children={
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6C21 5.46957 20.7893 4.96086 20.4142 4.58579C20.0391 4.21071 19.5304 4 19 4H17V2H15V4H9V2H7V4H5C4.46957 4 3.96086 4.21071 3.58579 4.58579C3.21071 4.96086 3 5.46957 3 6ZM19 20H5V8H19V20Z"
                    fill="#333333"
                  />
                </svg>
              }
            />
          )}
          <Input
            value={value}
            onChange={onChange}
            onClick={() => {
              // setPrevDate(date)
              onClick()
            }}
            borderColor="#B2CCCC"
            _focus={{
              borderColor: "#B2CCCC",
              boxShadow: "0 0 0 1px #00A5A8",
            }}
            onBlur={rest.onBlur}
            onFocus={rest.onFocus}
            onKeyDown={rest.onKeyDown}
            readOnly={rest.readOnly}
          />
        </InputGroup>
        <FormErrorMessage>{fieldState?.error?.message}</FormErrorMessage>
      </FormControl>
    )
  }
)

CustomInput.displayName = "CustomInput"

const DatePickerInput = ({
  date,
  setDate,
  field,
  fieldState,
  dateFormat = "dd/MM/yyyy",
  customOnChange = false,
  onChange,
  minDate,
  maxDate,
}: any) => {
  const [isOpen, setOpen] = useState(false)
  // const [prevDate, setPrevDate] = useState<any>(null)
  const months = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ]

  // const handleCalendarClose = () => {
  //   if (date) {
  //     if (!customOnChange) setDate(prevDate)
  //     field.onChange(prevDate)
  //   }
  // }
  // const handleCalendarOpen = () => {
  //   setPrevDate(date)
  //   field.onChange(date)
  // }

  return (
    <DatePicker
      ref={field.ref}
      name={field.name}
      onBlur={field.onBlur}
      open={isOpen}
      onInputClick={() => {
        setOpen(true)
      }}
      required={true}
      // onClickOutside={() => {
      //   if (date) {
      //     if (customOnChange) {
      //       onChange(prevDate)
      //     } else {
      //       setDate(prevDate)
      //       field.onChange(prevDate)
      //     }
      //   }

      //   setOpen(false)
      // }}
      onClickOutside={() => {
        setOpen(false)
      }}
      readOnly={dateFormat === "dd/MM/yyyy (ccc)"}
      selected={field.value}
      value={field.value}
      // onCalendarClose={handleCalendarClose}
      // onCalendarOpen={handleCalendarOpen}
      dateFormat={dateFormat}
      onChange={
        customOnChange
          ? (date) => {
              onChange(date)
              setOpen(false)
            }
          : (date) => {
              if (!customOnChange) setDate(date)
              field.onChange(date)
              setOpen(false)
            }
      }
      minDate={minDate ? minDate : null}
      maxDate={maxDate ? maxDate : null}
      customInput={
        <CustomInput
          fieldState={fieldState}
          // setPrevDate={setPrevDate}
          date={date}
          onReset={
            customOnChange
              ? () => {
                  onChange(null)
                  // setPrevDate(null)
                }
              : () => {
                  if (!customOnChange) setDate(null)
                  field.onChange(null)
                  // setPrevDate(null)
                }
          }
        />
      }
      renderCustomHeader={({
        date,
        changeYear,
        changeMonth,
        decreaseMonth,
        increaseMonth,
        prevMonthButtonDisabled,
        nextMonthButtonDisabled,
      }) => (
        <div
          style={{
            margin: 10,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Flex justifyContent="space-between" w="100%">
            <IconButton
              aria-label="left"
              onClick={decreaseMonth}
              disabled={prevMonthButtonDisabled}
              variant="ghost"
              icon={
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.0801 13.2537L6.82675 8.00033L12.0801 2.74699L10.6667 1.33366L4.00008 8.00033L10.6667 14.667L12.0801 13.2537Z"
                    fill="#333333"
                  />
                </svg>
              }
              _focus={{ boxShadow: "none" }}
            />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Text fontWeight={700} fontSize="24px" color="#00A5A8">
                {months[getMonth(date)]}
              </Text>
              <Text color="#00A5A8">{getYear(date)}</Text>
            </div>

            <IconButton
              aria-label="right"
              onClick={increaseMonth}
              disabled={nextMonthButtonDisabled}
              variant="ghost"
              icon={
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3.91992 2.74634L9.17326 7.99967L3.91992 13.253L5.33326 14.6663L11.9999 7.99967L5.33326 1.33301L3.91992 2.74634Z"
                    fill="#333333"
                  />
                </svg>
              }
              _focus={{ boxShadow: "none" }}
            />
          </Flex>
        </div>
      )}
      disabledKeyboardNavigation
      locale={th}
      shouldCloseOnSelect={true}
    >
      {/* <Flex justifyContent="flex-end" p="20px 10px 10px 10px">
        <Button
          variant="outline"
          mr={2}
          size="sm"
          color="#333333"
          borderColor="#333333"
          leftIcon={
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2C10.0222 2 8.08879 2.58649 6.4443 3.6853C4.79981 4.78412 3.51809 6.3459 2.76121 8.17317C2.00433 10.0004 1.8063 12.0111 2.19215 13.9509C2.578 15.8907 3.53041 17.6725 4.92894 19.0711C6.32746 20.4696 8.10929 21.422 10.0491 21.8079C11.9889 22.1937 13.9996 21.9957 15.8268 21.2388C17.6541 20.4819 19.2159 19.2002 20.3147 17.5557C21.4135 15.9112 22 13.9778 22 12C22 10.6868 21.7413 9.38642 21.2388 8.17317C20.7363 6.95991 19.9997 5.85752 19.0711 4.92893C18.1425 4.00035 17.0401 3.26375 15.8268 2.7612C14.6136 2.25866 13.3132 2 12 2ZM12 20C10.4178 20 8.87104 19.5308 7.55544 18.6518C6.23985 17.7727 5.21447 16.5233 4.60897 15.0615C4.00347 13.5997 3.84504 11.9911 4.15372 10.4393C4.4624 8.88743 5.22433 7.46197 6.34315 6.34315C7.46197 5.22433 8.88743 4.4624 10.4393 4.15372C11.9911 3.84504 13.5997 4.00346 15.0615 4.60896C16.5233 5.21447 17.7727 6.23984 18.6518 7.55544C19.5308 8.87103 20 10.4177 20 12C20 14.1217 19.1572 16.1566 17.6569 17.6569C16.1566 19.1571 14.1217 20 12 20Z"
                fill="#333333"
              />
              <path
                d="M15.6064 8.39364C15.4827 8.26891 15.3355 8.16991 15.1733 8.10235C15.0111 8.03478 14.8372 8 14.6615 8C14.4858 8 14.3119 8.03478 14.1497 8.10235C13.9876 8.16991 13.8404 8.26891 13.7167 8.39364L12 10.1236L10.2833 8.39364C10.0327 8.14305 9.69286 8.00227 9.33848 8.00227C8.98409 8.00227 8.64422 8.14305 8.39364 8.39364C8.14305 8.64422 8.00227 8.98409 8.00227 9.33848C8.00227 9.69286 8.14305 10.0327 8.39364 10.2833L10.1236 12L8.39364 13.7167C8.26891 13.8404 8.16991 13.9876 8.10235 14.1497C8.03478 14.3119 8 14.4858 8 14.6615C8 14.8372 8.03478 15.0111 8.10235 15.1733C8.16991 15.3355 8.26891 15.4827 8.39364 15.6064C8.51735 15.7311 8.66453 15.8301 8.8267 15.8977C8.98886 15.9652 9.1628 16 9.33848 16C9.51415 16 9.68809 15.9652 9.85026 15.8977C10.0124 15.8301 10.1596 15.7311 10.2833 15.6064L12 13.8764L13.7167 15.6064C13.8404 15.7311 13.9876 15.8301 14.1497 15.8977C14.3119 15.9652 14.4858 16 14.6615 16C14.8372 16 15.0111 15.9652 15.1733 15.8977C15.3355 15.8301 15.4827 15.7311 15.6064 15.6064C15.7311 15.4827 15.8301 15.3355 15.8977 15.1733C15.9652 15.0111 16 14.8372 16 14.6615C16 14.4858 15.9652 14.3119 15.8977 14.1497C15.8301 13.9876 15.7311 13.8404 15.6064 13.7167L13.8764 12L15.6064 10.2833C15.7311 10.1596 15.8301 10.0124 15.8977 9.85026C15.9652 9.68809 16 9.51415 16 9.33848C16 9.1628 15.9652 8.98886 15.8977 8.8267C15.8301 8.66453 15.7311 8.51735 15.6064 8.39364Z"
                fill="#333333"
              />
            </svg>
          }
          onClick={() => {
            if (customOnChange) {
              onChange(prevDate)
            } else {
              setDate(prevDate)
              field.onChange(prevDate)
            }

            setOpen(false)
          }}
        >
          ยกเลิก
        </Button>
        <Button
          size="sm"
          leftIcon={
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 12L11 15L16 10"
                stroke="#F9F9F9"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3 12C3 10.8181 3.23279 9.64778 3.68508 8.55585C4.13738 7.46392 4.80031 6.47177 5.63604 5.63604C6.47177 4.80031 7.46392 4.13738 8.55585 3.68508C9.64778 3.23279 10.8181 3 12 3C13.1819 3 14.3522 3.23279 15.4442 3.68508C16.5361 4.13738 17.5282 4.80031 18.364 5.63604C19.1997 6.47177 19.8626 7.46392 20.3149 8.55585C20.7672 9.64778 21 10.8181 21 12C21 14.3869 20.0518 16.6761 18.364 18.364C16.6761 20.0518 14.3869 21 12 21C9.61305 21 7.32387 20.0518 5.63604 18.364C3.94821 16.6761 3 14.3869 3 12V12Z"
                stroke="#F9F9F9"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          }
          onClick={() => {
            setPrevDate(date)
            field.onChange(date)
            setOpen(false)
          }}
        >
          ยืนยัน
        </Button>
      </Flex> */}
    </DatePicker>
  )
}

export default DatePickerInput
