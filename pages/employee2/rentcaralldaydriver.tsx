import { Button, Checkbox, Flex, FormControl, FormErrorMessage, FormHelperText, FormLabel, Grid, GridItem, Input, Radio, RadioGroup, Select, Stack, Text } from '@chakra-ui/react'
import Head from 'next/head';
import React, { useState } from 'react'
import { Controller } from 'react-hook-form';
import DatePickerInput from '../../components/input/Datepicker';
import axios from 'axios';
import { ref } from 'yup';


const RentCarAllDayDriver = () => {
    const [value, setValue] = useState("1")
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
            typecar:"",
            number_travelers:"",
            number_cars:"",
            startdate:"",
            enddate:"",
            locationIn:"",
            timeIn:"",
            LocationOut:"",
            timeOut:"",
            operational_area:"",
            overnight_stay:"",
            person_responsible_for_expenses:"",
            GL:"",
            cost_enter:"",
            order:"",
    })
    
    
    const [datas, setDatas] = useState<any>([])
    const [date, setDate] = useState<any>(new Date())
    // console.log(value);
    const handlebookingname = (event:React.ChangeEvent<HTMLInputElement>) => setform(prev=> { return {...prev,bookingname:event.target.value}})
    const handleemail = (event:React.ChangeEvent<HTMLInputElement>) => setform(prev=> { return {...prev,email:event.target.value}})
    const handleagency = (event:React.ChangeEvent<HTMLInputElement>) => setform(prev=> { return {...prev,agency:event.target.value}})
    const handledivision = (event:React.ChangeEvent<HTMLInputElement>) => setform(prev=> { return {...prev,division:event.target.value}})
    const handletel = (event:React.ChangeEvent<HTMLInputElement>) => setform(prev=> { return {...prev,tel:event.target.value}})
    const handlenote = (event:React.ChangeEvent<HTMLInputElement>) => setform(prev=> { return {...prev,note:event.target.value}})
    const handletypecar = (event:React.ChangeEvent<HTMLInputElement>) => setform(prev=> { return {...prev,typecar:event.target.value}})
    const handlenumber_travelers = (event:React.ChangeEvent<HTMLInputElement>) => setform(prev=> { return {...prev,number_travelers:event.target.value}})
    const handlenumber_cars = (event:React.ChangeEvent<HTMLInputElement>) => setform(prev=> { return {...prev,number_cars:event.target.value}})
    const handlestartdate = (event:React.ChangeEvent<HTMLInputElement>) => setform(prev=> { return {...prev,startdate:event.target.value}})
    const handleenddate = (event:React.ChangeEvent<HTMLInputElement>) => setform(prev=> { return {...prev,enddate:event.target.value}})
    const handlelocationIn = (event:React.ChangeEvent<HTMLInputElement>) => setform(prev=> { return {...prev,locationIn:event.target.value}})
    const handletimeIn = (event:React.ChangeEvent<HTMLInputElement>) => setform(prev=> { return {...prev,timeIn:event.target.value}})
    const handlelocationOut = (event:React.ChangeEvent<HTMLInputElement>) => setform(prev=> { return {...prev,LocationOut:event.target.value}})
    const handletimeOut = (event:React.ChangeEvent<HTMLInputElement>) => setform(prev=> { return {...prev,timeOut:event.target.value}})
    const handleoperational_area = (event:React.ChangeEvent<HTMLInputElement>) => setform(prev=> { return {...prev,operational_area:event.target.value}})
    const handleovernight_stay = (event:React.ChangeEvent<HTMLInputElement>) => setform(prev=> { return {...prev,overnight_stay:event.target.value}})
    const handleperson_responsible_for_expenses = (event:React.ChangeEvent<HTMLInputElement>) => setform(prev=> { return {...prev,person_responsible_for_expenses:event.target.value}})
    const handleGL = (event:React.ChangeEvent<HTMLInputElement>) => setform(prev=> { return {...prev,GL:event.target.value}})
    const handlecost_enter = (event:React.ChangeEvent<HTMLInputElement>) => setform(prev=> { return {...prev,cost_enter:event.target.value}})
    const handleorder = (event:React.ChangeEvent<HTMLInputElement>) => setform(prev=> { return {...prev,order:event.target.value}})
    const handleSubmit = (event: any) => {
        // alert('You clicked submit');
        event.preventDefault();
        let data = new FormData(event.currentTarget);
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
            "typecar":null,
            "number_travelers":form.number_travelers,
            "number_cars":form.number_cars,
            "startdate":form.startdate,
            "enddate":form.enddate,
            "locationIn":form.locationIn,
            "timeIn":form.timeIn,
            "LocationOut":form.LocationOut,
            "timeOut":form.timeOut,
            "operational_area":form.operational_area,
            "overnight_stay":form.overnight_stay,
            "person_responsible_for_expenses":form.person_responsible_for_expenses,
            "GL":form.GL,
            "cost_enter":form.cost_enter,
            "order":form.order,
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

    const isError = datas.note === ''
    return (
        <>
            <Head>
                <title>จองรถเช่าเหมาวัน(พร้อมคนขับ)</title>
                <meta name="description" content="reservation" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <form onSubmit={handleSubmit}>
                <Text className='head-text' >จองรถเช่าเหมาวัน(พร้อมคนขับ)</Text>
                <Grid h='200px'
                    templateRows='repeat(2, 1fr)'
                    templateColumns='repeat(6, 1fr)'
                    gap={4}>
                    <GridItem colSpan={2} >
                        <FormControl >
                            <FormLabel className='lable-rentcar'>วันที่จองรถ</FormLabel>
                            <Input style={{ border: '1px #00AAAD solid' }} name="booking_date" type="date" value={new Date(Date.now()).toISOString().split("T")[0]} />
                        </FormControl>
                    </GridItem>
                    <GridItem colSpan={4} />
                    <GridItem colSpan={2}>
                        <FormControl>
                            <FormLabel className='lable-rentcar'>ชื่อผู้จองรถ</FormLabel>
                            <Input style={{ border: '1px #00AAAD solid' }} name="bookingname" value={form.bookingname} onChange={handlebookingname}  />
                        </FormControl>
                    </GridItem>
                    <GridItem colSpan={2}>
                        <FormControl>
                            <FormLabel className='lable-rentcar'>Email</FormLabel>
                            <Input style={{ border: '1px #00AAAD solid' }} name="email" value={form.email} onChange={handleemail} />
                        </FormControl>
                    </GridItem>
                    <GridItem colSpan={2} />
                    <GridItem colSpan={2}>
                        <FormControl>
                            <FormLabel className='lable-rentcar'>หน่วยงาน</FormLabel>
                            <Input style={{ border: '1px #00AAAD solid' }} name="agency" value={form.agency} onChange={handleagency} />
                        </FormControl>
                    </GridItem>
                    <GridItem colSpan={2}>
                        <FormControl>
                            <FormLabel className='lable-rentcar'>ส่วนงาน</FormLabel>
                            <Input style={{ border: '1px #00AAAD solid' }} name="division" value={form.division} onChange={handledivision} />
                        </FormControl>
                    </GridItem>
                    <GridItem colSpan={2}>
                        <FormControl>
                            <FormLabel className='lable-rentcar'>เบอร์โทรศัพท์</FormLabel>
                            <Input style={{ border: '1px #00AAAD solid' }} onChange={handletel} name='tel' value={form.tel}  />
                        </FormControl>
                    </GridItem>
                    <GridItem colSpan={4}>
                        <FormControl isInvalid={isError}>
                            <FormLabel className='lable-rentcar'>วัตถุประสงค์ในการจอดรถ</FormLabel>
                            <Input style={{ border: '1px #00AAAD solid' }} onChange={handlenote} value={form.note} name='note' />
                            {/* {isError &&
                                <FormErrorMessage>Email is required.</FormErrorMessage>
                            } */}
                        </FormControl>
                    </GridItem>
                    <GridItem colSpan={6}>
                        <FormControl>
                            <FormLabel className='lable-rentcar'>ประเภทรถที่ขอ</FormLabel>
                            <Flex>
                                <Checkbox colorScheme='green' marginRight={"30px"} >
                                    รถตู้
                                </Checkbox>
                                <Stack direction='row' alignItems={"baseline"}>
                                    <FormLabel className='lable-rentcar'>จำนวนคัน</FormLabel>
                                    <Input style={{ border: '1px #00AAAD solid', margin: "0px 10px" }} maxWidth={"100"} value={form.number_travelers} onChange={handlenumber_travelers} name='number_travelers' /><Text>คัน</Text>
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
                    <GridItem colSpan={6}>
                        <FormControl>
                            <Flex>
                                <Checkbox colorScheme='green' marginRight={"20px"} >
                                รถเก๋ง
                                </Checkbox>
                                <Stack direction='row' alignItems={"baseline"}>
                                    <FormLabel className='lable-rentcar'>จำนวนคัน</FormLabel>
                                    <Input style={{ border: '1px #00AAAD solid', margin: "0px 10px" }} maxWidth={"100"} value={form.number_cars} onChange={handlenumber_cars} name='number_cars' /><Text>คัน</Text>
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
                    <GridItem colSpan={2}>
                        <FormControl>
                            <Stack direction='row' alignItems={"baseline"}>
                                <FormLabel className='lable-rentcar'>จำนวนผู้เดินทาง</FormLabel>
                                <Input style={{ border: '1px #00AAAD solid' }} maxWidth={"50"} /><Text >คน</Text>
                            </Stack>
                        </FormControl>
                    </GridItem>
                    <GridItem colSpan={4} />
                    <GridItem colSpan={2}>
                        {/* <FormControl>
                            <Stack direction='row' alignItems={"baseline"}>
                                <FormLabel className='lable-rentcar'>จำนวนคัน</FormLabel>
                                <Input style={{ border: '1px #00AAAD solid', marginLeft: "48px" }} maxWidth={"50"} /><Text>คัน</Text>
                            </Stack>
                        </FormControl> */}
                    </GridItem>
                    <GridItem colSpan={4} />
                    <GridItem colSpan={2}>
                        <FormControl >
                            <FormLabel className='lable-rentcar'>วันที่ใช้รถเริ่มต้น</FormLabel>
                            {/* <Controller
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
                            <Input style={{ border: '1px #00AAAD solid' }} type="date" value={form.startdate} onChange={handlestartdate} />
                        </FormControl>
                    </GridItem>
                    <GridItem colSpan={2}>
                        <FormControl >
                            <FormLabel className='lable-rentcar'>วันที่ใช้รถสิ้นสุด</FormLabel>
                            <Input style={{ border: '1px #00AAAD solid' }} type="date" value={form.enddate} onChange={handleenddate} />
                        </FormControl>
                    </GridItem>
                    <GridItem colSpan={2} />
                    <GridItem colSpan={2}>
                        <FormControl>
                            <FormLabel className='lable-rentcar'>สถานที่รับ</FormLabel>
                            <Input style={{ border: '1px #00AAAD solid' }} value={form.locationIn} onChange={handlelocationIn} />
                        </FormControl>
                    </GridItem>
                    <GridItem colSpan={2}>
                        <FormControl>
                            <FormLabel className='lable-rentcar'>เวลา</FormLabel>
                            <Input style={{ border: '1px #00AAAD solid' }} type="time" value={form.timeIn} onChange={handletimeIn} />
                        </FormControl>
                    </GridItem>
                    <GridItem colSpan={2} />
                    <GridItem colSpan={2}>
                        <FormControl>
                            <FormLabel className='lable-rentcar'>สถานที่ส่ง</FormLabel>
                            <Input style={{ border: '1px #00AAAD solid' }} value={form.LocationOut} onChange={handlelocationOut} />
                        </FormControl>
                    </GridItem>
                    <GridItem colSpan={2}>
                        <FormControl>
                            <FormLabel className='lable-rentcar'>เวลา</FormLabel>
                            <Input style={{ border: '1px #00AAAD solid' }} type="time" value={form.timeOut} onChange={handletimeOut} />
                        </FormControl>
                    </GridItem>
                    <GridItem colSpan={2} />
                    <GridItem colSpan={2}>
                        <FormControl>
                            <FormLabel className='lable-rentcar'>พื้นที่การปฏิบัติงาน</FormLabel>
                            <Select placeholder='Select option' style={{ border: '1px #00AAAD solid' }} value={form.operational_area} onChange={handleoperational_area}>
                                <option value='option1'>กรุงเทพฯ/ปริมณฑล</option>
                                <option value='option2'>ต่างจังหวัด</option>
                            </Select>
                        </FormControl>
                    </GridItem>
                    <GridItem colSpan={4} />
                    <GridItem colSpan={2}>
                        <FormControl>
                            <FormLabel className='lable-rentcar'>ข้อมูลการพักค้างคืน</FormLabel>
                            <Select placeholder='Select option' style={{ border: '1px #00AAAD solid' }} value={form.overnight_stay} onChange={handleovernight_stay}>
                                <option value='option1'>ค้างคืน</option>
                                <option value='option2'>ไม่ค้างคืน</option>
                            </Select>
                        </FormControl>
                    </GridItem>
                    <GridItem colSpan={4} />
                    <GridItem colSpan={2}>
                        <FormControl>
                            <FormLabel className='lable-rentcar'>ผู้รับผิดชอบค่าใช้จ่าย</FormLabel>
                            <Select onChange={handleperson_responsible_for_expenses} name='pay' placeholder='Select option' style={{ border: '1px #00AAAD solid' }} value={form.person_responsible_for_expenses}>
                                <option value='1'>SKC</option>
                                <option value='2'>อื่นๆ</option>
                            </Select>
                        </FormControl>
                    </GridItem>
                    {datas.pay == '2' ?
                        <>
                            <GridItem colSpan={2}>
                                <FormControl>
                                    <FormLabel className='lable-rentcar'>อื่นๆ</FormLabel>
                                    <Input style={{ border: '1px #00AAAD solid' }} />
                                </FormControl>
                            </GridItem>
                            <GridItem colSpan={2} />
                        </>
                        :
                        <GridItem colSpan={4} />
                    }
                    <GridItem colSpan={2}>
                        <FormControl>
                            <FormLabel className='lable-rentcar'>GL</FormLabel>
                            <Input style={{ border: '1px #00AAAD solid' }} value={form.GL} onChange={handleGL} />
                        </FormControl>
                    </GridItem>
                    <GridItem colSpan={2}>
                        <FormControl>
                            <FormLabel className='lable-rentcar'>Cost Enter</FormLabel>
                            <Input style={{ border: '1px #00AAAD solid' }} id='cost-enter' name='cost-enter' value={form.cost_enter} onChange={handlecost_enter} />
                        </FormControl>
                    </GridItem>
                    <GridItem colSpan={2}>
                        <FormControl>
                            <FormLabel className='lable-rentcar'>Order</FormLabel>
                            <Input style={{ border: '1px #00AAAD solid' }} id='cost-enter' name='cost-enter' value={form.order} onChange={handleorder} />
                        </FormControl>
                    </GridItem>
                    <GridItem colSpan={2}>
                        <Button className='lable-rentcar' type='submit' colorScheme='teal' size='md' px={'10'} py={'5'} mb={"20px"}>
                            ส่งแบบฟอร์ม
                        </Button>
                    </GridItem>
                </Grid>

            </form >



        </>

    )
}

export default RentCarAllDayDriver