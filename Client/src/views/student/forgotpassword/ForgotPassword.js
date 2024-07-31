import React, { useState, useEffect } from 'react';
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from "react-redux";
import { getAllStudent, resetpasswords } from "../../../redux/actions/adminAction";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const students = useSelector((state) => state.admin.allStudent) || [];

  useEffect(() => {
    dispatch(getAllStudent());
  }, [dispatch]);

  const handleForgotPassword = () => {
    if (selectedStudentId) {
      dispatch(resetpasswords(selectedStudentId))
        .then(() => {
          toast.success("Yêu cầu lấy lại mật khẩu đã được gửi thành công!");
        })
        .catch((error) => {
          toast.error("Đã xảy ra lỗi khi gửi yêu cầu lấy lại mật khẩu.");
        });
    } else {
      toast.error("Vui lòng chọn mã số sinh viên.");
    }
  };

  return (
    <CContainer>
      <CRow className="justify-content-center">
        <CCol md={9} lg={7} xl={6}>
          <CCard className="mx-4">
            <CCardBody className="p-4">
              <CForm>
                <h4>Lấy lại mật khẩu</h4>
                <CInputGroup className="mb-3">
                  <CInputGroupText>Mã số sinh viên</CInputGroupText>
                  <select
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                  >
                    <option value="">Chọn mã số sinh viên</option>
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.mssv} - {student.maSinhVien}
                      </option>
                    ))}
                  </select>
                </CInputGroup>
                <div className="d-grid mt-4">
                  <CButton color="success" onClick={handleForgotPassword}>
                    Gửi yêu cầu
                  </CButton>
                </div>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <ToastContainer />
    </CContainer>
  );
};

export default ForgotPassword;
