import { Box, Button, Flex, FormControl, FormErrorMessage, FormHelperText, FormLabel, Grid, GridItem, Input, Radio, RadioGroup, Select, Stack, Text } from '@chakra-ui/react'
import Head from 'next/head';
import React, { useState } from 'react'
import { Controller } from 'react-hook-form';
import DatePickerInput from '../../components/input/Datepicker';
import { AiOutlineSearch, AiOutlineEdit, AiOutlineDelete, AiOutlineMessage } from "react-icons/ai";
import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
} from '@chakra-ui/react'
const Evaluation = () => {
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
                <title>ตรวจสอบสถานะการจองรถ</title>
                <meta name="description" content="reservation" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Grid templateColumns='repeat(6, 1fr)'>
                <GridItem colSpan={6}>
                    <Box border="solid 1px #00A5A8" p={4} borderRadius={"10px"} justifySelf={"center"}>
                        <Text color={'#00A5A8'} fontSize='xl' as={'b'} className='lable-rentcar'>ประเมินความพึงพอใจ</Text>

                        <Grid style={{ justifyContent: "center" }} >
                            <Flex p={2} mt={2} >
                                <label className='lable-statusrentcar' style={{ width: "150px" }}>ประเภทการประเมิน</label>
                                <Select placeholder='เลือกการประเมิน' width={'400px'}>
                                    <option value='1'>จองรถเช่าเหมาวัน(พร้อมคนขับ)</option>
                                    <option value='2'>จองรถเช่าเหมาวัน(ไม่มีคนขับคนขับ)</option>
                                    <option value='3'>จองรถรับส่งระหว่างวัน</option>
                                </Select>
                                <Button className='lable-rentcar' type='submit' colorScheme='teal' size='md' ml={5}><AiOutlineSearch />ค้นหา</Button>
                            </Flex>
                        </Grid>

                    </Box>
                </GridItem>
                <GridItem colSpan={6}>
                    <Box mt={"50px"}>
                        <TableContainer borderRadius={"10px"} border={'1px #00A5A8 solid'}>
                            <Table size='md'>
                                <Thead bgColor={'#00A5A8'} height={"40px"} >
                                    <Tr>
                                        <Th color={"white"}>ลำดับ</Th>
                                        <Th color={"white"}>วันจอง/เวลา</Th>
                                        <Th color={"white"}>ชื่อผู้จองรถ</Th>
                                        <Th color={"white"}>ประเภทรถ</Th>
                                        <Th color={"white"}>จำนวน(คัน)</Th>
                                        <Th color={"white"}>วันที่ใช้รถเริ่มต้น/เวลา</Th>
                                        <Th color={"white"}>วันที่ใช้รถสิ้นสุด/เวลา</Th>
                                        <Th color={"white"}>สถานที่รับ</Th>
                                        <Th color={"white"}>สถานที่ส่ง</Th>
                                        <Th color={"white"}>ทะเบียนรถ</Th>
                                        <Th color={"white"}>ชื่อคนขับ</Th>
                                        <Th color={"white"}>เบอร์โทร</Th>
                                        <Th color={"white"}>ผู้ให้บริการ</Th>
                                        <Th color={"white"}>ประเมินความพึงพอใจ</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    <Tr>
                                        <Td>1</Td>
                                        <Td>millimetres (mm)</Td>
                                        <Td isNumeric>25.4</Td>
                                        <Td>inches</Td>
                                        <Td>millimetres (mm)</Td>
                                        <Td isNumeric>25.4</Td>
                                        <Td>inches</Td>
                                        <Td>millimetres (mm)</Td>
                                        <Td isNumeric>25.4</Td>
                                        <Td>millimetres (mm)</Td>
                                        <Td isNumeric>25.4</Td>
                                        <Td>inches</Td>
                                        <Td>millimetres (mm)</Td>
                                        <Td ><Button fontSize={'12px'}><AiOutlineMessage />&nbsp; แบบประเมิน</Button></Td>
                                    </Tr>
                                    <Tr>
                                        <Td>2</Td>
                                        <Td>centimetres (cm)</Td>
                                        <Td isNumeric>30.48</Td>
                                        <Td>feet</Td>
                                        <Td>centimetres (cm)</Td>
                                        <Td isNumeric>30.48</Td>
                                        <Td>feet</Td>
                                        <Td>centimetres (cm)</Td>
                                        <Td isNumeric>30.48</Td>
                                        <Td>centimetres (cm)</Td>
                                        <Td isNumeric>30.48</Td>
                                        <Td>feet</Td>
                                        <Td>centimetres (cm)</Td>
                                        <Td ><Button fontSize={'12px'}><AiOutlineMessage />&nbsp; แบบประเมิน</Button></Td>

                                    </Tr>
                                    <Tr>
                                        <Td>3</Td>
                                        <Td>metres (m)</Td>
                                        <Td isNumeric>0.91444</Td>
                                        <Td>yards</Td>
                                        <Td>metres (m)</Td>
                                        <Td isNumeric>0.91444</Td>
                                        <Td>yards</Td>
                                        <Td>metres (m)</Td>
                                        <Td isNumeric>0.91444</Td>
                                        <Td>centimetres (cm)</Td>
                                        <Td isNumeric>30.48</Td>
                                        <Td>feet</Td>
                                        <Td>centimetres (cm)</Td>
                                        <Td ><Button fontSize={'12px'}><AiOutlineMessage />&nbsp; แบบประเมิน</Button></Td>

                                    </Tr>
                                </Tbody>

                            </Table>
                        </TableContainer>
                    </Box>
                </GridItem>
            </Grid>
        </>
    )
}

export default Evaluation