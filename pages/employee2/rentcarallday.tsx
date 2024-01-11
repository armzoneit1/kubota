import { Button, Checkbox, Flex, FormControl, FormErrorMessage, FormHelperText, FormLabel, Grid, GridItem, Input, Radio, RadioGroup, Select, Stack, Text } from '@chakra-ui/react'
import Head from 'next/head';
import React, { useState } from 'react'
import axios from 'axios';
import { Controller } from 'react-hook-form';
import DatePickerInput from '../../components/input/Datepicker';


const RentCarAllDay = () => {
    const [value, setValue] = useState("1")
    const [datas, setDatas] = useState<any>([])
    const [date, setDate] = useState<any>(new Date())
    // console.log(value);
    const [form, setform] = useState({
        idcarbooking:null,
        PlantId:null,
        employee_no:null,
        booking_date:"2023-12-06 03:54:07.6233333 +00:00",
        bookingname:"",
        email:"",
        agency:"",
        division:"",
        tel:"",
        note:"",
        code_employee:"",
        name_use_car:"",
        tel_use_car:"",
        pathfile:""
})
    const handlebookingname = (event:React.ChangeEvent<HTMLInputElement>) => setform(prev=> { return {...prev,bookingname:event.target.value}})
    const handleemail = (event:React.ChangeEvent<HTMLInputElement>) => setform(prev=> { return {...prev,email:event.target.value}})
    const handleagency = (event:React.ChangeEvent<HTMLInputElement>) => setform(prev=> { return {...prev,agency:event.target.value}})
    const handledivision = (event:React.ChangeEvent<HTMLInputElement>) => setform(prev=> { return {...prev,division:event.target.value}})
    const handletel = (event:React.ChangeEvent<HTMLInputElement>) => setform(prev=> { return {...prev,tel:event.target.value}})
    const handlenote = (event:React.ChangeEvent<HTMLInputElement>) => setform(prev=> { return {...prev,note:event.target.value}})
    const handlecode_employee = (event:React.ChangeEvent<HTMLInputElement>) => setform(prev=> { return {...prev,code_employee:event.target.value}})
    const handlename_use_car = (event:React.ChangeEvent<HTMLInputElement>) => setform(prev=> { return {...prev,name_use_car:event.target.value}})
    const handletel_use_car = (event:React.ChangeEvent<HTMLInputElement>) => setform(prev=> { return {...prev,tel_use_car:event.target.value}})
    const handlepathfile = (event:React.ChangeEvent<HTMLInputElement>) => setform(prev=> { return {...prev,pathfile:event.target.value}})
    const handleSubmit = (event: any) => {
        // alert('You clicked submit');
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        // console.log(data.get('cost-enter'));
        let jsonref = [{
            "idcarbooking":null,
            "PlantId":null,
            "employee_no":null,
            "booking_date":"2023-12-06 03:54:07.6233333 +00:00",
            "bookingname":form.bookingname,
            "email":form.email,
            "agency":form.agency,
            "division":form.division,
            "tel":form.tel,
            "note":form.note,
            "code_employee":form.code_employee,
            "name_use_car":form.name_use_car,
            "tel_use_car":form.tel_use_car,
            "pathfile":form.pathfile
        }];
        console.log([JSON.stringify(form)]);
        console.log("aaaa",jsonref);
        // console.log(data.get('cost-enter'));
        axios.post('http://43.229.78.39:8055/ReserveCar/InsertCarBookingWithDriver',jsonref).then((response) => {
            console.log(response);
        }).catch((error) => {
            console.log(error);
        });
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
                            <Input value={form.bookingname} onChange={handlebookingname} style={{ border: '1px #00AAAD solid' }} />
                        </FormControl>
                    </GridItem>
                    <GridItem colSpan={4}>
                        <FormControl>
                            <FormLabel className='lable-rentcar'>Email</FormLabel>
                            <Input value={form.email} onChange={handleemail} style={{ border: '1px #00AAAD solid' }} />
                        </FormControl>
                    </GridItem>
                    <GridItem colSpan={4} />
                    <GridItem colSpan={4}>
                        <FormControl>
                            <FormLabel className='lable-rentcar'>หน่วยงาน</FormLabel>
                            <Input value={form.agency} onChange={handleagency} style={{ border: '1px #00AAAD solid' }} />
                        </FormControl>
                    </GridItem>
                    <GridItem colSpan={4}>
                        <FormControl>
                            <FormLabel className='lable-rentcar'>ส่วนงาน</FormLabel>
                            <Input value={form.division} onChange={handledivision} style={{ border: '1px #00AAAD solid' }} />
                        </FormControl>
                    </GridItem>
                    <GridItem colSpan={4}>
                        <FormControl>
                            <FormLabel className='lable-rentcar'>เบอร์โทรศัพท์</FormLabel>
                            <Input value={form.tel}  style={{ border: '1px #00AAAD solid' }} onChange={handletel} name='phone' />
                        </FormControl>
                    </GridItem>
                    <GridItem colSpan={4}>
                        <FormControl>
                            <FormLabel className='lable-rentcar'>รหัสพนักงานผู้ใช้งาน</FormLabel>
                            <Input style={{ border: '1px #00AAAD solid' }} value={form.code_employee} onChange={handlecode_employee} />
                        </FormControl>
                    </GridItem>
                    <GridItem colSpan={4}>
                        <FormControl>
                            <FormLabel className='lable-rentcar'>ชื่อผู้ใช้รถ</FormLabel>
                            <Input style={{ border: '1px #00AAAD solid' }} value={form.name_use_car} onChange={handlename_use_car} />
                        </FormControl>
                    </GridItem>
                    <GridItem colSpan={4}>
                        <FormControl>
                            <FormLabel className='lable-rentcar'>เบอร์โทรศัพท์ผู้ใช้รถ</FormLabel>
                            <Input style={{ border: '1px #00AAAD solid' }} onChange={handletel_use_car} name='phone' value={form.tel_use_car} />
                        </FormControl>
                    </GridItem>
                    <GridItem colSpan={4}>
                        <FormControl>
                            <FormLabel className='lable-rentcar'>ข้อมูลใบขับขี่บริษัท</FormLabel>
                            <RadioGroup  >
                                <Stack direction='row' alignItems={"baseline"} >
                                    <Radio value='1'>มีใบขับขี่ เลขที่ </Radio><Input style={{ border: '1px #00AAAD solid', width: '150px' }} />
                                </Stack>
                            </RadioGroup>
                        </FormControl>
                    </GridItem>
                    <GridItem colSpan={4}>
                        <FormControl >
                            <FormLabel htmlFor="file-input" id='file-input-label' className='lable-rentcar'>แนบไฟล์ใบขับขี่</FormLabel>
                            <Input style={{ border: '0px solid', color: '#00AAAD' }} type='file' id="file-input" name="file-input" />
                            {/* <label id="file-input-label" htmlFor="file-input">แนบไฟล์ใบขับขี่ </label> */}
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
                                <Checkbox colorScheme='green' marginRight={"20px"} >
                                    รถตู้
                                </Checkbox>
                                <Stack direction='row' alignItems={"baseline"} marginRight={"20px"}  marginLeft={"10px"}>
                                    <FormLabel className='lable-rentcar'>ยี่ห้อรุ่น</FormLabel>
                                    <Input style={{ border: '1px #00AAAD solid' }} maxWidth={"150"}  />
                                </Stack>
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
                                <Stack direction='row' alignItems={"baseline"} marginRight={"20px"}>
                                    <FormLabel className='lable-rentcar'>ยี่ห้อรุ่น</FormLabel>
                                    <Input style={{ border: '1px #00AAAD solid' }} maxWidth={"150"}  />
                                </Stack>
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
                    
                    <GridItem colSpan={9} />

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
                            <FormLabel className='lable-rentcar'>เวลา</FormLabel>
                            <Input style={{ border: '1px #00AAAD solid' }} type="time" />
                        </FormControl>
                    </GridItem>
                    <GridItem colSpan={4} />

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
                    <GridItem colSpan={4} />

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

export default RentCarAllDay