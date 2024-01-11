import { Button, FormControl, FormErrorMessage, FormHelperText, FormLabel, Grid, GridItem, Input, Radio, RadioGroup, Select, Stack, Text } from '@chakra-ui/react'
import Head from 'next/head';
import React, { useState } from 'react'
import { Controller } from 'react-hook-form';


const SetRentCarAllDayDriver = () => {
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
                <title>เพิ่มข้อมูลรถและคนขับรถ</title>
                <meta name="description" content="reservation" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <form onSubmit={handleSubmit}>
                <Text className='head-text' >เพิ่มข้อมูลรถและคนขับรถ</Text>
                <Grid h='200px'
                    templateRows='repeat(2, 1fr)'
                    templateColumns='repeat(6, 1fr)'
                    gap={4}>
                    <GridItem colSpan={2}>
                        <FormControl>
                            <FormLabel className='lable-rentcar'>ผู้ให้บริการ</FormLabel>
                            <Input style={{ border: '1px #00AAAD solid' }} />
                        </FormControl>
                    </GridItem>
                    <GridItem colSpan={2}>
                        <FormControl>
                            <FormLabel className='lable-rentcar'>ประเภทรถ</FormLabel>
                            <Select onChange={handleChange} name='typecar' placeholder='Select option' style={{ border: '1px #00AAAD solid' }}>
                                <option value='1'>รถเก๋ง</option>
                                <option value='2'>รถตู้</option>
                            </Select>
                        </FormControl>
                    </GridItem>
                    <GridItem colSpan={2} />
                    <GridItem colSpan={2}>
                        <FormControl>
                            <FormLabel className='lable-rentcar'>ทะเบียนรถ</FormLabel>
                            <Input style={{ border: '1px #00AAAD solid' }} id='cost-enter' name='cost-enter' />
                        </FormControl>
                    </GridItem>
                    <GridItem colSpan={2}>
                        <FormControl>
                            <FormLabel className='lable-rentcar'>วันที่จดทะเบียนรถ</FormLabel>
                            <Input style={{ border: '1px #00AAAD solid' }} id='cost-enter' name='cost-enter' />
                        </FormControl>
                    </GridItem>
                    <GridItem colSpan={2} />
                    <GridItem colSpan={2}>
                        <FormControl>
                            <FormLabel className='lable-rentcar'>ชื่อคนขับ</FormLabel>
                            <Input style={{ border: '1px #00AAAD solid' }} id='cost-enter' name='cost-enter' />
                        </FormControl>
                    </GridItem>
                    <GridItem colSpan={2}>
                        <FormControl>
                            <FormLabel className='lable-rentcar'>เบอร์โทรศัพท์</FormLabel>
                            <Input style={{ border: '1px #00AAAD solid' }} id='cost-enter' name='cost-enter' />
                        </FormControl>
                    </GridItem>
                    <GridItem colSpan={2} />

                    <GridItem colSpan={2}>
                        <Button className='lable-rentcar' type='submit' colorScheme='teal' size='md' px={'10'} py={'5'}>
                            บันทึก
                        </Button>
                    </GridItem>

                </Grid>

            </form >



        </>

    )
}

export default SetRentCarAllDayDriver