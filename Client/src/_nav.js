import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilSpeedometer,
  cilSchool, 
  cilPeople,
  cilLibrary,
  cilBook,
  cilUser,
  cilChartPie,  // Giữ lại một khai báo duy nhất của cilChartPie
  cilUserPlus,
  cilLockLocked
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Thống Kê',
    to: '/admin/thongke',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: '',
    },
  },
  {
    component: CNavTitle,
    name: 'Học tập',
  },
  {
    component: CNavItem,
    name: 'Điểm',
    to: '/admin/quanly/diem',
    icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Lớp',
    to: '/admin/quanly/lop',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Quản Lý',
  },
  {
    component: CNavItem,
    name: 'Khoa',
    to: '/admin/quanly/khoa',
    icon: <CIcon icon={cilSchool} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Môn Học',
    to: '/admin/quanly/monhoc',
    icon: <CIcon icon={cilBook} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Chuyên Ngành',
    to: '/admin/quanly/nganhhoc',
    icon: <CIcon icon={cilLibrary} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Sinh Viên',
    to: '/admin/quanly/sinhvien',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Tạo Tài Khoản  ',
  },
  {
    component: CNavGroup,
    name: 'Tài khoản',
    to: '/base',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Đăng Ký',
        to: '/admin/quanly/dangky',
        icon: <CIcon icon={cilUserPlus} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Lấy lại mật khẩu',
        to: '/admin/quanly/laylaimatkhau',
        icon: <CIcon icon={cilLockLocked} customClassName="nav-icon" />,
      },
    ],
  },
];

export default _nav;
