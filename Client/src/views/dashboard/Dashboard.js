import React, {useState, useEffect} from 'react'
import classNames from 'classnames'

import {
  CAvatar,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cibCcAmex,
  cibCcApplePay,
  cibCcMastercard,
  cibCcPaypal,
  cibCcStripe,
  cibCcVisa,
  cibGoogle,
  cibFacebook,
  cibLinkedin,
  cifBr,
  cifEs,
  cifFr,
  cifIn,
  cifPl,
  cifUs,
  cibTwitter,
  cilCloudDownload,
  cilPeople,
  cilUser,
  cilUserFemale,
} from '@coreui/icons'

import avatar1 from 'src/assets/images/avatars/1.jpg'
import avatar2 from 'src/assets/images/avatars/2.jpg'
import avatar3 from 'src/assets/images/avatars/3.jpg'
import avatar4 from 'src/assets/images/avatars/4.jpg'
import avatar5 from 'src/assets/images/avatars/5.jpg'
import avatar6 from 'src/assets/images/avatars/6.jpg'

import WidgetsBrand from '../widgets/WidgetsBrand'
import WidgetsDropdown from '../widgets/WidgetsDropdown'
import MainChart from './MainChart'
import { useDispatch, useSelector } from "react-redux";

import {  getAllMajor, getAllSubject, getAllClass, getAllStudent } from "../../redux/actions/adminAction";

const Dashboard = () => {
  const dispatch = useDispatch();
  const Majors = useSelector((state) => state.admin.allMajor) || [];
  const Subjects = useSelector((state) => state.admin.allSubject) || [];
  const Students = useSelector((state) => state.admin.allStudent) || [];
  const Class = useSelector((state) => state.admin.allClasss) || [];
  const [currentClassId, setCurrentClassId] = useState(null); 


  const getStudentCountInClass = (classId) => {
    if (!Students || Students.length === 0) return 0;
    return Students.filter(student => student.maLop === classId).length;
  };

  const getTotalStudentCountByMajorViaClass = () => {
    let totalCounts = {};
    if (Majors.length === 0 || Students.length === 0 || Class.length === 0) return totalCounts;

    // Lấy danh sách sinh viên theo từng lớp và tính tổng theo từng chuyên ngành
    Majors.forEach(major => {
      const studentIdsInMajor = [];
      Class.forEach(klass => {
        if (klass.maChuyenNganh === major.id) {
          const studentsInClass = Students.filter(student => student.maLop === klass.id);
          studentsInClass.forEach(student => {
            if (!studentIdsInMajor.includes(student.id)) {
              studentIdsInMajor.push(student.id);
            }
          });
        }
      });
      totalCounts[major.id] = studentIdsInMajor.length;
    });

    return totalCounts;
  };

  const totalStudentCounts = getTotalStudentCountByMajorViaClass();

  const countSubjectsByMajor = Majors.map(major => ({
    majorName: major.tenChuyenNganh,
    subjectCount: Subjects.filter(subject => subject.maChuyenNganh === major.id).length,
  }));
 
  useEffect(() => {
    dispatch(getAllSubject());
    dispatch(getAllMajor());
    dispatch(getAllClass());
    dispatch(getAllStudent());
  }, [dispatch]);


  return (
    <>
      <WidgetsDropdown className="mb-4" />
  
      <CRow>
        <CCol xs="12" md="6">
          <CCard className="mb-4">
            <CCardHeader>Thống kê số lượng sinh viên theo chuyên ngành</CCardHeader>
            <CCardBody>
              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead className="text-nowrap">
                  <CTableRow>
                    <CTableHeaderCell className="bg-body-tertiary">Chuyên ngành</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">Số lượng sinh viên</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {Majors.map((major, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell className="text-left">{major.tenChuyenNganh}</CTableDataCell>
                      <CTableDataCell className="text-center">{totalStudentCounts[major.id] || 0}</CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
  
        <CCol xs="12" md="6">
          <CCard className="mb-4">
            <CCardHeader>Thống kê số lượng sinh viên theo từng lớp</CCardHeader>
            <CCardBody>
              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead className="text-nowrap">
                  <CTableRow>
                    <CTableHeaderCell className="bg-body-tertiary">Mã lớp</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Tên lớp</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">Số lượng sinh viên</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {Class.map((cls, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell className="text-left">{cls.maLop}</CTableDataCell>
                      <CTableDataCell className="text-left">{cls.tenLop}</CTableDataCell>
                      <CTableDataCell className="text-center">{getStudentCountInClass(cls.id)}</CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
  
      <CRow>
        <CCol xs="12">
          <CCard className="mb-4">
            <CCardHeader>Thống kê số lượng môn học theo từng chuyên ngành</CCardHeader>
            <CCardBody>
              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead className="text-nowrap">
                  <CTableRow>
                    <CTableHeaderCell className="bg-body-tertiary">Chuyên ngành</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">Số lượng môn học</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {countSubjectsByMajor.map((item, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell className="text-left">{item.majorName}</CTableDataCell>
                      <CTableDataCell className="text-center">{item.subjectCount}</CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
  
}

export default Dashboard
