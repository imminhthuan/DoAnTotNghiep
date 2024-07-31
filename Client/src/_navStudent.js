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
  cilPuzzle,
  cilSettings,
  cilLockLocked
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _navStudent = [
  {
    component: CNavTitle,
    name: 'Sinh viên',
  },
  {
    component: CNavItem,
    name: 'Thông tin sinh viên',
    to: '/student/sinhvien/Sinhvien',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Điểm',
    to: '/student/sinhvien/diem',
    icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Tài Khoản',
  },
  {
    component: CNavGroup,
    name: 'Tài khoản',
    to: '/base',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Đổi mật khẩu',
        to: '/student/taikhoan/doimatkhau',
        icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
      }
    ],
  },
];

export default _navStudent;
