import { element, exact } from 'prop-types'
import React from 'react'

// Students
const Studentss = React.lazy(() => import('./views/student/students/Studentss'))
const Marks = React.lazy(() => import('./views/student/marks/Marks'))
const Doimatkhau = React.lazy(() => import('./views/student/changepassword/ChangePassword'))


const routesStudent = [
  { path: '/', exact: true, name: 'HomeStudent' },
  { path: 'sinhvien/Sinhvien' ,name: 'Sinh Viên', element: Studentss},
  { path: 'sinhvien/diem', name: 'Điểm', element: Marks},

  { path: '/taikhoan/doimatkhau', name: 'Đổi Mật Khẩu', element: Doimatkhau },
]

export default routesStudent
