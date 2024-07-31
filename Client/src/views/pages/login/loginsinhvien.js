import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { loginuser } from "../../../redux/actions/adminAction";
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilUser } from '@coreui/icons';

const schema = yup.object({
  username: yup.string().required("Tên đăng nhập là bắt buộc"),
  password: yup.string().required("Mật khẩu là bắt buộc"),
}).required();

const defaultValues = {
  username: "",
  password: "",
};

const loginsinhvien = () => {
  const [loading, setLoading] = useState(false);
  const [translate, setTranslate] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    setTimeout(() => {
      setTranslate(true);
    }, 1000);
  }, []);

  const onSubmit = async ({ username, password }) => {
    try {
      setLoading(true);
      await dispatch(loginuser({ username, password }, navigate));
      navigate('/student/sinhvien/Sinhvien'); 
    } catch (error) {
      setLoading(false);
      setErrorMessage("Tên đăng nhập hoặc mật khẩu không chính xác.");
    }
  };

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleSubmit(onSubmit)}>
                    <h1>Đăng Nhập</h1>
                    <p className="text-body-secondary">Đăng nhập vào tài khoản của bạn</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <Controller
                        name="username"
                        control={control}
                        render={({ field }) => (
                          <CFormInput
                            placeholder="Tên đăng nhập"
                            autoComplete="username"
                            {...field}
                          />
                        )}
                      />
                    </CInputGroup>
                    {errors.username && <p className="text-danger">{errors.username.message}</p>}
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <Controller
                        name="password"
                        control={control}
                        render={({ field }) => (
                          <CFormInput
                            type={showPassword ? "text" : "password"}
                            placeholder="Mật khẩu"
                            autoComplete="current-password"
                            {...field}
                          />
                        )}
                      />
                    </CInputGroup>
                    {errors.password && <p className="text-danger">{errors.password.message}</p>}
                    {errorMessage && (
                      <p className="text-danger mt-2">
                        {errorMessage}
                      </p>
                    )}
                    <CRow>
                      <CCol xs={6}>
                        <CButton color="primary" type='submit' className="px-4" disabled={loading}>
                          {loading ? 'Đang xử lý...' : 'Đăng Nhập'}
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                      
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5" style={{ width: '44%', overflow: 'hidden' }}>
              <CCardBody className="text-center d-flex align-items-center justify-content-center p-0">
                <div className="square-image-container">
                  <div className="square-image">
                    <div className="text-center text-white">
                      <h2 className="mb-3 fs-3">Chào mừng đến với hệ thống</h2>
                      <p>Đăng nhập để cập nhật điểm số của bạn</p>
                    </div>
                  </div>
                </div>
              </CCardBody>
            </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default loginsinhvien;
