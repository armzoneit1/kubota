import { Button, Checkbox, Flex, FormControl, FormErrorMessage, FormHelperText, FormLabel, Grid, GridItem, Input, Radio, RadioGroup, Select, Stack, Text } from '@chakra-ui/react'
import Head from 'next/head';
import React, { useState } from 'react'
import { Controller } from 'react-hook-form';
import DatePickerInput from '../../components/input/Datepicker';


const RentCar = () => {
    const [value, setValue] = useState("1")
    const [datas, setDatas] = useState<any>([])
    const [date, setDate] = useState<any>(new Date())
    // console.log(value);
    const handleSubmit = (event: any) => {
        // alert('You clicked submit');
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        // console.log(data.get('cost-enter'));

    }

    const handleChange = (event: any) => {
        let value = event.target.value;
        setDatas({ ...datas, [event.target.name]: event.target.value })
    }
    console.log(datas);

    const isError = datas.note === ''
    return (
        <>
            <Head>
                <title>จองรถเช่าเหมาวัน(ไม่มีคนขับ)</title>
                <meta name="description" content="reservation" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <form onSubmit={handleSubmit}>
                <Text className='head-text' >จองรถเช่าเหมาวัน(ไม่มีคนขับ)</Text>
                <Grid h='200px'
                    templateRows='repeat(2, 1fr)'
                    templateColumns='repeat(12, 1fr)'
                    gap={4}>
                    <GridItem colSpan={4}>
                        <FormControl>
                            <FormLabel className='lable-rentcar'>วันที่จองรถ</FormLabel>
                            <Input style={{ border: '1px #00AAAD solid' }} type="date" value={new Date(Date.now()).toISOString().split("T")[0]} />
                        </FormControl>
                    </GridItem>
                    <GridItem colSpan={8} />
                    <GridItem colSpan={4}>
                        <FormControl>
                            <FormLabel className='lable-rentcar'>ชื่อผู้จองรถ</FormLabel>
                            <Input disabled style={{ border: '1px #00AAAD solid' }} />
                        </FormControl>
                    </GridItem>
                    <GridItem colSpan={4}>
                        <FormControl>
                            <FormLabel className='lable-rentcar'>Email</FormLabel>
                            <Input disabled style={{ border: '1px #00AAAD solid' }} />
                        </FormControl>
                    </GridItem>
                    <GridItem colSpan={4} />
                    <GridItem colSpan={4}>
                        <FormControl>
                            <FormLabel className='lable-rentcar'>หน่วยงาน</FormLabel>
                            <Input disabled style={{ border: '1px #00AAAD solid' }} />
                        </FormControl>
                    </GridItem>
                    <GridItem colSpan={4}>
                        <FormControl>
                            <FormLabel className='lable-rentcar'>ส่วนงาน</FormLabel>
                            <Input disabled style={{ border: '1px #00AAAD solid' }} />
                        </FormControl>
                    </GridItem>
                    <GridItem colSpan={4}>
                        <FormControl>
                            <FormLabel className='lable-rentcar'>เบอร์โทรศัพท์</FormLabel>
                            <Input style={{ border: '1px #00AAAD solid' }} onChange={handleChange} name='phone' />
                        </FormControl>
                    </GridItem>
                  
                    <GridItem colSpan={8}>
                        <FormControl isInvalid={isError}>
                            <FormLabel className='lable-rentcar'>วัตถุประสงค์ในการจอดรถ</FormLabel>
                            <Input style={{ border: '1px #00AAAD solid' }} onChange={handleChange} name='note' />
                            {isError &&
                                <FormErrorMessage>Email is required.</FormErrorMessage>
                            }
                        </FormControl>
                    </GridItem>
                    <GridItem colSpan={12}>
                        <FormControl>
                            <FormLabel className='lable-rentcar'>ประเภทรถที่ขอ</FormLabel>
                            <Flex>
                                <Checkbox colorScheme='green' marginRight={"30px"} >
                                    รถตู้
                                </Checkbox>
                                <Stack direction='row' alignItems={"baseline"}>
                                    <FormLabel className='lable-rentcar'>จำนวนคัน</FormLabel>
                                    <Input style={{ border: '1px #00AAAD solid', margin: "0px 10px" }} maxWidth={"100"} /><Text>คัน</Text>
                                </Stack>
                            </Flex>
                            {/* <RadioGroup onChange={setValue} value={value}>
                                <Stack direction='row'>
                                    <Radio value='1'>รถตู้</Radio>
                                    <Radio value='2'>รถเก๋ง</Radio>
                                </Stack>
                            </RadioGroup> */}
                        </FormControl>
                    </GridItem>
                    <GridItem colSpan={12}>
                        <FormControl>
                            <Flex>
                                <Checkbox colorScheme='green' marginRight={"20px"} >
                                รถเก๋ง
                                </Checkbox>
                                <Stack direction='row' alignItems={"baseline"}>
                                    <FormLabel className='lable-rentcar'>จำนวนคัน</FormLabel>
                                    <Input style={{ border: '1px #00AAAD solid', margin: "0px 10px" }} maxWidth={"100"} /><Text>คัน</Text>
                                </Stack>
                            </Flex>
                            {/* <RadioGroup onChange={setValue} value={value}>
                                <Stack direction='row'>
                                    <Radio value='1'>รถตู้</Radio>
                                    <Radio value='2'>รถเก๋ง</Radio>
                                </Stack>
                            </RadioGroup> */}
                        </FormControl>
                    </GridItem>
                    <GridItem colSpan={3}>
                        <FormControl>
                            <Stack direction='row' alignItems={"baseline"}>
                                <FormLabel className='lable-rentcar'>จำนวนผู้เดินทาง</FormLabel>
                                <Input style={{ border: '1px #00AAAD solid' }} maxWidth={"50"} /><Text >คน</Text>
                            </Stack>
                        </FormControl>
                    </GridItem>
                   
                   
                    <GridItem colSpan={6}/>

                    <GridItem colSpan={4}>
                        <FormControl isRequired>
                            <FormLabel className='lable-rentcar'>วันที่ใช้รถเริ่มต้น</FormLabel>
                            {/* <Cont roller
                                 name={`date`}
                                control={control}
                                render={({ field, fieldState }) => (
                                    <DatePickerInput
                                        date={date ?? null}
                                        minDate={new Date()}
                                        field={field}
                                        fieldState={fieldState}
                                        dateFormat="dd/MM/yyyy (ccc)"
                                        customOnChange={true}
                                        onChange={(date: any) => {
                                            field.onChange(date)
                                            handleSetDate(date)
                                            if (date == null) {
                                                setError("date", {
                                                    message: "กรุณาเลือกวันที่",
                                                    type: "required",
                                                })
                                            } else {
                                                clearErrors("date")
                                            }

                                            if (!(date === watchDate)) {
                                                setValue(`timeTableRoundId`, null)
                                            }
                                            unregister(`timeTableRoundId`)
                                        }}
                                    />
                                )}
                                rules={{
                                    required: "กรุณาเลือกวันที่",
                                }}
                            /> */}
                            <Input style={{ border: '1px #00AAAD solid' }} type="date" />
                        </FormControl>
                    </GridItem>
                    <GridItem colSpan={4}>
                        <FormControl isRequired>
                            <FormLabel className='lable-rentcar'>วันที่ใช้รถสิ้นสุด</FormLabel>
                            <Input style={{ border: '1px #00AAAD solid' }} type="date" />
                        </FormControl>
                    </GridItem>
                    <GridItem colSpan={4} />
                    <GridItem colSpan={4}>
                        <FormControl>
                            <FormLabel className='lable-rentcar'>สถานที่รับ</FormLabel>
                            <Input style={{ border: '1px #00AAAD solid' }} />
                        </FormControl>
                    </GridItem>
                    <GridItem colSpan={4}>
                        <FormControl>
                            <FormLabel className='lable-rentcar'>เวลา</FormLabel>
                            <Input style={{ border: '1px #00AAAD solid' }} type="time" />
                        </FormControl>
                    </GridItem>
                    <GridItem colSpan={4} />
                    <GridItem colSpan={4}>
                        <FormControl>
                            <FormLabel className='lable-rentcar'>สถานที่ส่ง</FormLabel>
                            <Input style={{ border: '1px #00AAAD solid' }} />
                        </FormControl>
                    </GridItem>
                    <GridItem colSpan={4}>
                        <FormControl>
                            <FormLabel className='lable-rentcar'>เวลา</FormLabel>
                            <Input style={{ border: '1px #00AAAD solid' }} type="time" />
                        </FormControl>
                    </GridItem>
                    <GridItem colSpan={4} />
                   
                    <GridItem colSpan={4}>
                        <FormControl>
                            <FormLabel className='lable-rentcar'>ผู้รับผิดชอบค่าใช้จ่าย</FormLabel>
                            <Select onChange={handleChange} name='pay' placeholder='Select option' style={{ border: '1px #00AAAD solid' }}>
                                <option value='1'>SKC</option>
                                <option value='2'>อื่นๆ</option>
                            </Select>
                        </FormControl>
                    </GridItem>
                    {datas.pay == '2' ?
                        <>
                            <GridItem colSpan={4}>
                                <FormControl>
                                    <FormLabel className='lable-rentcar'>อื่นๆ</FormLabel>
                                    <Input style={{ border: '1px #00AAAD solid' }} />
                                </FormControl>
                            </GridItem>
                            <GridItem colSpan={2} />
                        </>
                        :
                        <GridItem colSpan={8} />
                    }
                    <GridItem colSpan={4}>
                        <FormControl>
                            <FormLabel className='lable-rentcar' >GL</FormLabel>
                            <Input style={{ border: '1px #00AAAD solid' }} />
                        </FormControl>
                    </GridItem>
                   

                    <GridItem colSpan={4}>
                        <FormControl>
                            <FormLabel className='lable-rentcar'>Cost Enter</FormLabel>
                            <Input style={{ border: '1px #00AAAD solid' }} id='cost-enter' name='cost-enter' />
                        </FormControl>
                    </GridItem>

                    <GridItem colSpan={4}>
                        <FormControl>
                            <FormLabel className='lable-rentcar'>Order</FormLabel>
                            <Input style={{ border: '1px #00AAAD solid' }} id='order' name='order' />
                        </FormControl>
                    </GridItem>

                    <GridItem colSpan={4}>
                        <Button className='lable-rentcar' type='submit' colorScheme='teal' size='md' px={'32'} py={'8'} mb={"20px"}>
                            ส่งแบบฟอร์ม
                        </Button>
                    </GridItem>
                </Grid>

            </form >



        </>

    )
}

export default RentCar