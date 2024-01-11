import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as RiIcons from 'react-icons/ri';

export const SidebarData = [
  {
    title: 'งานรถเช่าเหมาวัน (พร้อมคนขับรถ)',
    path: '/overview',
    icon: <AiIcons.AiFillHome />,
    iconClosed: <IoIcons.IoIosArrowDown  />,
    iconOpened: <IoIcons.IoIosArrowUp />,

    subNav: [
      {
        title: 'จัดรถเช่าเหมาวัน (พร้อมคนขับรถ)',
        path: '/overview/users',
      },
      {
        title: 'เพิ่มข้อมูลรถและคนขับรถ',
        path: '/overview/revenue',
      },
      {
        title: 'รายงานข้อมูลรถและคนขับรถ',
        path: '/overview/revenue',
      },
      {
        title: 'รายงานการขอใช้รถเช่าเหมาวัน (พร้อมคนขับ)',
        path: '/overview/revenue',
      },
      {
        title: 'สรุปปริมาณการใช้รถเช่าเหมาวัน (พร้อมคนขับ)',
        path: '/overview/revenue',
      },
      {
        title: 'สรุปผลการประเมินความพึงพอใจรถเช่าเหมาวัน',
        path: '/overview/revenue',
      }
    ]
  },
  {
    title: 'Reports',
    path: '/reports',
    icon: <IoIcons.IoIosPaper />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      {
        title: 'Reports',
        path: '/reports/reports1',
        icon: <IoIcons.IoIosPaper />,
        cName: 'sub-nav'
      },
      {
        title: 'Reports 2',
        path: '/reports/reports2',
        icon: <IoIcons.IoIosPaper />,
        cName: 'sub-nav'
      },
      {
        title: 'Reports 3',
        path: '/reports/reports3',
        icon: <IoIcons.IoIosPaper />
      }
    ]
  },
  {
    title: 'Products',
    path: '/products',
    icon: <FaIcons.FaCartPlus />
  },
  {
    title: 'Team',
    path: '/team',
    // icon: <IoIcons.IoMdPeople />
  },
  {
    title: 'Messages',
    path: '/messages',
    icon: <FaIcons.FaEnvelopeOpenText />,

    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      {
        title: 'Message 1',
        path: '/messages/message1',
        icon: <IoIcons.IoIosPaper />
      },
      {
        title: 'Message 2',
        path: '/messages/message2',
        icon: <IoIcons.IoIosPaper />
      }
    ]
  },
 
];
