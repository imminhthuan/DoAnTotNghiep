
import { CCard, CCardHeader, CCardBody, CButton } from '@coreui/react'
import { DocsLink } from 'src/components'
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactPaginate from "react-paginate";
import { AddAllStudents, addStudent, deleteStudent, getAllClass, getAllStudent, updateStudent } from "../../../redux/actions/adminAction";
import { ADD_ALL_STUDENT,ADD_STUDENT, SET_ERRORS } from "../../../redux/actionTypes";
import { useNavigate } from "react-router-dom";
import '../mark/mark.css';
import './student.css';
import moment from 'moment';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';


import * as XLSX from 'xlsx';


const Sinhvien = () => {
    const [showModal, setShowModal] = useState(false);
    const [showModalssss, setShowModalssss] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentStudentId, setCurrentStudentId] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const dispatch = useDispatch();
    const [error, setError] = useState({});
    const Students = useSelector((state) => state.admin.allStudent) || [];
    const Class = useSelector((state) => state.admin.allClasss) || [];
    const [loading, setLoading] = useState(false);
    const store = useSelector((state) => state);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [checkedValue, setCheckedValue] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedClassId, setSelectedClassId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModalss, setShowModalss] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [value, setValue] = useState({
        hoTen: "",
        ngaySinh: "",
        email: "", 
        soDienThoai: "",
        diaChi: "",
        gioiTinh: "",
        nienKhoa: "",
        trinhDo: "",
        maLop: "",
    });
    const [search, setSearch] = useState(false);
  
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 10;
  
    useEffect(() => {
      if (Object.keys(store.errors).length !== 0) {
        setError(store.errors);
        setValue({
          hoTen: "",
          ngaySinh: "",
          email: "", 
          soDienThoai: "",
          diaChi: "",
          gioiTinh: "",
          nienKhoa: "",
          trinhDo: "",
          maLop: "",
        });
      }
    }, [store.errors]);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setError({});
      
      if (!value.hoTen || !value.ngaySinh || !value.email || !value.soDienThoai || !value.maLop || !value.diaChi) {
        toast.error("Vui lòng điền đầy đủ thông tin.");
        setLoading(false);
        return;
      }

      const srudentss = Students.find((studentt) => studentt.email == value.email || studentt.soDienThoai == value.soDienThoai);
      if(srudentss){
        toast.error("Sinh viên này đã tồn tại")
        return;
      }

      

      const formData = {
        hoTen: value.hoTen,
        ngaySinh: value.ngaySinh,
        email: value.email,
        soDienThoai: value.soDienThoai,
        diaChi: value.diaChi,
        gioiTinh: value.gioiTinh,
        nienKhoa: value.nienKhoa,
        trinhDo: value.trinhDo,
        maLop: value.maLop,
      };
  
      console.log("Form Data:", formData); 
    
      try {
        if (isEditing) {
          // Đây là trường hợp chỉnh sửa
          await dispatch(updateStudent(currentStudentId, formData));
          console.log("Form currentStudentId:", formData); 
          toast.success("Chỉnh sửa sinh viên thành công!");
        } else {
          // Đây là trường hợp thêm mới
          await dispatch(addStudent(formData));
          toast.success("Thêm sinh viên thành công!");
        }
        setIsEditing(false);
        setShowModalss(false);// Ẩn modal sau khi thêm thành công
        setValue({ hoTen: "", ngaySinh: "", email: "" , soDienThoai: "", diaChi: "",  gioiTinh: "",nienKhoa: "",trinhDo: "", maLop: ""});
        // Tải lại trang để cập nhật danh sách lớp
        dispatch(getAllStudent());
      } catch (error) {
        console.error("Error adding class:", error);
        setError({ backendError: "Error adding class" });
        setLoading(false);
      }
    };
  
    useEffect(() => {
      if (store.errors || store.admin.studentAdd) {
        setLoading(false);
        if (store.admin.studentAdd) {
          setValue({
            hoTen: "",
            ngaySinh: "",
            email: "", 
            soDienThoai: "",
            diaChi: "",
            gioiTinh: "",
            nienKhoa: "",
            trinhDo: "",
            maLop: "",
          });
  
          dispatch({ type: SET_ERRORS, payload: {} });
          dispatch({ type: ADD_STUDENT, payload: false });
        }
      } else {
        setLoading(true);
      }
    }, [store.errors, store.admin.studentAdd]);

    useEffect(() => {
      if (store.errors || store.admin.AddAllStudent) {
        setLoading(false);
        if (store.admin.AddAllStudent) {
          setValue({
          
            hoTen: "",
            ngaySinh: "",
            email: "", 
            soDienThoai: "",
            diaChi: "",
            gioiTinh: "",
            nienKhoa: "",
            trinhDo: "",
            maLop: "",
          });
  
          dispatch({ type: SET_ERRORS, payload: {} });
          dispatch({ type: ADD_ALL_STUDENT, payload: false });
        }
      } else {
        setLoading(true);
      }
    }, [store.errors, store.admin.AddAllStudent]);
  
    useEffect(() => {
      setLoading(true);
      dispatch(getAllStudent());
      dispatch(getAllClass());
    }, [dispatch]);
  
    useEffect(() => {
      if (Object.keys(store.errors).length !== 0) {
        setError(store.errors);
        setLoading(false);
      }
    }, [store.errors]);
  
  
    const handleInputChange = (e) => {
      const tempCheck = checkedValue;
      let index;
      if (e.target.checked) {
        tempCheck.push(e.target.value);
      } else {
        index = tempCheck.indexOf(e.target.value);
        tempCheck.splice(index, 1);
      }
      setCheckedValue(tempCheck);
    };
  
    useEffect(() => {
      dispatch({ type: SET_ERRORS, payload: {} });
    }, [dispatch]);
  
  
    const handleEditButtonClick = (dep) => {
      setIsEditing(true);
      setCurrentStudentId(dep.id);
      setValue({hoTen: dep.hoTen, ngaySinh: dep.ngaySinh, email: dep.email, soDienThoai: dep.soDienThoai, diaChi: dep.diaChi,gioiTinh: dep.gioiTinh,nienKhoa: dep.nienKhoa,trinhDo: dep.trinhDo, maLop: dep.maLop});
      setShowModalss(true);
    };
  
      
    const handdelete = (e) => {
      setShowAddForm(false);
    }
  
  
    const handleDeleteButtonClick = async (id) => {
      setLoading(true);
      try {
        await dispatch(deleteStudent(id));
        toast.success("Xóa Thành Công")
        dispatch(getAllStudent()); 
        dispatch(getAllClass()); 
      } catch (error) {
        console.error("Error deleting class:", error);
        setLoading(false);
      }
    };
  
    const handleSearchChange = (e) => {
      setSearchTerm(e.target.value);
  };

  const handleClassChange = (e) => {
    const selectedClassId = e.target.value;
    setSelectedClassId(selectedClassId);
}; 

  
    const handlePageClick = (data) => {
      setCurrentPage(data.selected);
    };
  
    const getStudentNameById = (ID) => {
        if (!Class || Class.length === 0) return 'N/A'; // Handle case where majors is undefined or empty
        const classs = Class.find((classs) => classs.id === ID);
        return classs ? classs.tenLop : 'N/A';
      };

      const getStudentNameByIdsss = (ID) => {
        if (!Class || Class.length === 0) return 'N/A'; // Handle case where majors is undefined or empty
        const classs = Class.find((classs) => classs.id === ID);
        return classs ? classs.maLop : 'N/A';
      };

    const offset = currentPage * itemsPerPage;
    const currentPageData = Array.isArray(Students) ? Students.slice(offset, offset + itemsPerPage) : [];
    const pageCount = Array.isArray(Students) ? Math.ceil(Students.length / itemsPerPage) : 0;
    const startIndex = currentPage * itemsPerPage + 1;

    const filteredStudents = useMemo(() => {
      if(!selectedClassId && !searchTerm){
        return currentPageData
      }

      if (!searchTerm) {
          return currentPageData.filter(student => student.maLop === selectedClassId);
      }

      if(!selectedClassId){
        return currentPageData.filter(student => student.hoTen.toLowerCase().includes(searchTerm.toLowerCase()));
      }

      return currentPageData.filter(student =>
          student.hoTen.toLowerCase().includes(searchTerm.toLowerCase()) && student.maLop === selectedClassId
      );
      
    }, [currentPageData, searchTerm, selectedClassId]);


    const handleCloseModalss = () => {
      setShowModalss(false);
    };

    const handleShowModalss = () => {
      setShowModalss(true);
  };

  const handleCloseModalssss = () => {
    setShowModalssss(false);
  }
  const handleModalssss = (student) => {
    setSelectedStudent(student);
    setShowModalssss(true);
  }

  const exportLop = async () => {
    // Tạo workbook và worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sinh Viên');
  
    // Định nghĩa header và dữ liệu
    const headers = ['STT', 'MSSV', 'Họ và tên', 'Ngày sinh','Email', 'Số điện thoại', 'Địa chỉ', 'Lớp học'];
    const dataToExport = Students.map((student, index) => [
        index + 1,
        student.maSinhVien,
        student.hoTen,
        student.email,
        student.soDienThoai,
        student.diaChi,
        getStudentNameById(student.maLop)
    ]);
  
    // Thêm header vào worksheet
    worksheet.addRow(headers);
  
    // Định dạng header
    headers.forEach((header, index) => {
        const cell = worksheet.getCell(1, index + 1);
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFF00' }
        };
        cell.font = {
            bold: true
        };
        cell.alignment = {
            vertical: 'middle', 
            horizontal: 'center'
        };
        cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };
    });
  
    // Thêm dữ liệu vào worksheet
    dataToExport.forEach((row) => {
        worksheet.addRow(row);
    });
  
    // Kẻ bảng cho tất cả các ô
    worksheet.eachRow((row, rowNumber) => {
        row.eachCell((cell, colNumber) => {
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
            cell.alignment = {
                vertical: 'middle', 
                horizontal: 'left' // Căn trái cho cột "Số Tín Chỉ", căn giữa cho các cột khác
            };
        });
    });
  
    // Tự động điều chỉnh độ rộng của cột
    worksheet.columns.forEach(column => {
        let maxLength = 0;
        column.eachCell({ includeEmpty: true }, cell => {
            const columnLength = cell.value ? cell.value.toString().length : 10;
            if (columnLength > maxLength) {
                maxLength = columnLength;
            }
        });
        column.width = maxLength + 2; // Thêm khoảng cách để không bị quá chật
    });
  
    // Ghi workbook vào buffer
    const buffer = await workbook.xlsx.writeBuffer();
  
    // Tạo Blob từ buffer và lưu tệp
    const dataBlob = new Blob([buffer], { type: 'application/octet-stream' });
    saveAs(dataBlob, 'Danh sách sinh viên.xlsx');
  };



  const handImport = (event) => {
    if (event.target && event.target.files && event.target.files[0]) {
      let file = event.target.files[0];
      if (file.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        toast.error("Chỉ chấp nhận tệp xlsx...");
        return;
      }
      console.log("file", file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rawCSV = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
        if (rawCSV.length > 0) {
          if (rawCSV[0] && rawCSV[0].length === 9) {
            if (rawCSV[0][0] !== "hoTen" || rawCSV[0][1] !== "ngaySinh" || rawCSV[0][2] !== "email" || rawCSV[0][3] !== "soDienThoai" || rawCSV[0][4] !== "diaChi" || rawCSV[0][5] !== "gioiTinh" || rawCSV[0][6] !== "nienKhoa" || rawCSV[0][7] !== "trinhDo"  || rawCSV[0][8] !== "maLop") {
              toast.error("Định dạng tiêu đề tệp xlsx không đúng...");
            } else {
              let studentsToAdd = [];
              rawCSV.forEach((item, index) => {
                if (index > 0 && item.length === 9) {
                  // Tìm mã lớp từ tên lớp
                  const classObj = Class.find(cls => cls.tenLop === item[8]);
                  if (!classObj) {
                      toast.error(`Không tìm thấy mã lớp cho lớp ${item[8]}`);
                      return;
                  }
                  let student = {
                    hoTen: item[0],
                    ngaySinh: moment(item[1], "DD-MM-YYYY").format("YYYY-MM-DD"),
                    email: item[2],
                    soDienThoai: item[3],
                    diaChi: item[4],
                    gioiTinh: item[5],
                    nienKhoa: item[6],
                    trinhDo: item[7],
                    maLop: classObj.id
                  };
                  studentsToAdd.push(student);
                }
              });
              console.log(">>> check studentsToAdd", studentsToAdd);
              
                // Bọc students trong 'sinhViens' array
              const studentsToAddJson = { sinhViens: studentsToAdd };
              console.log("json", studentsToAddJson);

              if (studentsToAdd.length > 0) { // Kiểm tra nếu có sinh viên để thêm
                // Gửi hành động để thêm sinh viên
                dispatch(AddAllStudents(studentsToAddJson));
                toast.success("Thêm sinh viên thành công");
                setLoading(true);
                dispatch(getAllStudent()); 
              } else {
                toast.error("Lỗi: Không có sinh viên nào để thêm");
              }
            }
          } else {
            toast.error("Định dạng tệp xlsx không đúng");
          }
        } else {
          toast.error("Lỗi tệp");
        }
      };
      reader.readAsArrayBuffer(file);
    }
  }
  
  
 
  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>
          <div className='row add-new'>
            <div className='col-lg-4'>
            Sinh viên
            </div>
            <div className='col-lg-8 search-container'>
              {/* <input type="text" id="myInput" value={searchTerm}  onChange={handleSearchChange} placeholder="Tìm kiếm..." className="search-input"/> */}
              <select className="search-combobox" onChange={handleClassChange}>
                <option value="">Chọn lớp</option>
                {Class && Class.map((classs) => (
                  <option key={classs.id} value={classs.id}>{classs.tenLop}</option>
                ))}
              </select>
              <label htmlFor='test' className='btn adds-newss mr-2 mt-2'>
                <i className='fa-solid fa-file-import mr-2 mt-1'></i> Import
              </label>
              <input id="test" type='file' hidden onChange={(event) => handImport(event)}/>
              <button onClick={exportLop}  className="btn add-new mr-2" type="button" data-toggle="tooltip" data-placement="top" title="In file"><i className="fas fa-download mr-2 mt-1"></i>Xuất file</button>  
              <button onClick={handleShowModalss} className="nv btn add-newss" type="button" data-toggle="tooltip" data-placement="top"
                      title="Thêm Sinh Viên"><i className="fas fa-user-plus mr-2 mt-1"></i>Nhập sinh viên</button> 
            </div>
          </div>
        </CCardHeader>
        <CCardBody>
        <form >
        <div className="table-responsive">
        <table className="table table-bordered">
                      <thead className="thead-dark">
                        <tr>
                          <th>STT</th>
                          {/* <th>Select</th> */}
                          <th className="text-center">MSSV</th>  
                          <th className="text-center">Họ và tên</th>
                          <th className="text-center">Giới tính</th>
                          <th className="text-center">Lớp học</th>
                          <th className="text-center">Chức năng</th>
                        </tr>
                      </thead>
                      <tbody>
                      {filteredStudents && filteredStudents.length > 0 ? (
                              filteredStudents.map((student, idx) => (
                                <tr key={idx}>
                                  <td className="text-center">
                                  {startIndex + idx}
                                  </td>
                                        <td className="text-left" onClick={() => handleModalssss(student)}>
                                         <i className="fas fa-search mr-2"></i>{student.maSinhVien} 
                                        </td>
                                        <td className="text-left">
                                            {student.hoTen}
                                        </td>
                                        <td className="text-left">
                                            {student.gioiTinh}
                                        </td>
                                        <td className="text-left">
                                            {getStudentNameById(student.maLop)}
                                        </td>
                                        <td className="text-center">
                                            <button className="btn btn-warning mr-3 cursor-pointer icon-button" onClick={() => handleEditButtonClick(student)}>
                                               Sửa
                                            </button>
                                            <button className="btn btn-danger mr-3 cursor-pointer icon-button" onClick={() => handleDeleteButtonClick(student.id)}>
                                              Xóa
                                            </button>
                                        </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="9" className="text-center">Không có dữ liệu sinh viên.</td>
                              </tr>
                            )}
                      </tbody>
                    </table>
        </div>
                    
                  </form>

                  <div className={`modal ${showModalss ? 'show' : ''}`} tabIndex="-1" role="dialog" style={{ display: showModalss ? 'block' : 'none' }}>
        <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">Thông Tin Điểm Sinh Viên</h5>
                    <button type="button" className="close" onClick={handleCloseModalss} aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                  <form>
                    <div className='row'>
                        <div className='col-lg-4'>
                          <div className="form-group">
                            <label htmlFor="hoTen">Họ và tên:</label>
                            <input type="text" className="form-control" id="hoTen" name="hoTen" placeholder="Nhập tên sinh viên" value={value.hoTen} onChange={(e) => setValue({ ...value, hoTen: e.target.value })} />
                          </div>
                        </div>
                        <div className='col-lg-4'>
                          <div className="form-group">
                            <label htmlFor="ngaySinh">Ngày Sinh:</label>
                            <input type="date" className="form-control" id="ngaySinh" name="ngaySinh" placeholder="Ngày sinh..." value={value.ngaySinh} onChange={(e) => setValue({ ...value, ngaySinh: e.target.value })} />
                          </div>
                        </div>
                        <div className='col-lg-4'>
                          <div className="form-group">
                            <label htmlFor="email">Email:</label>
                            <input type="email" className="form-control" id="email" name="email" placeholder="Email" value={value.email} onChange={(e) => setValue({ ...value, email: e.target.value })} />
                          </div>  
                        </div>
                        <div className='col-lg-4'>
                          <div className="form-group">
                            <label htmlFor="diaChi">Địa chỉ:</label>
                            <input type="text" className="form-control" id="diaChi" name="diaChi" placeholder="Nhập địa chỉ" value={value.diaChi} onChange={(e) => setValue({ ...value, diaChi: e.target.value })} />
                          </div>
                        </div>
                        <div className='col-lg-4'>
                          <div className="form-group">
                            <label htmlFor="soDienThoai">Số Điện Thoại:</label>
                            <input type="text" className="form-control" id="soDienThoai" name="soDienThoai" placeholder="Số điện thoại" value={value.soDienThoai} onChange={(e) => setValue({ ...value, soDienThoai: e.target.value })} />
                          </div>
                        </div>
                        <div className='col-lg-4'>
                          <div className="form-group">
                            <label htmlFor="gioiTinh">Giới tính:</label>
                            <select className="form-control" id="gioiTinh" name="gioiTinh" value={value.gioiTinh} onChange={(e) => setValue({ ...value, gioiTinh: e.target.value })}>
                              <option value="nam">Nam</option>
                              <option value="nu">Nữ</option>
                            </select>
                          </div>
                        </div>
                        <div className='col-lg-4'>
                          <div className="form-group">
                            <label htmlFor="trinhDo">Trình độ:</label>
                            <select className="form-control" id="trinhDo" name="trinhDo" value={value.trinhDo} onChange={(e) => setValue({ ...value, trinhDo: e.target.value })}>
                              <option value="caoDang">Cao đẳng</option>
                              <option value="daiHoc">Đại học</option>
                            </select>
                          </div>
                        </div>

                        <div className='col-lg-4'>
                          <div className="form-group">
                            <label htmlFor="nienKhoa">Niên khóa:</label>
                            <input type="text" className="form-control" id="nienKhoa" name="nienKhoa" placeholder="Số điện thoại" value={value.nienKhoa} onChange={(e) => setValue({ ...value, nienKhoa: e.target.value })} />
                          </div>
                        </div>
                        <div className='col-lg-4'>
                          <div className="form-group">
                              <label htmlFor="maLop">Tên Lớp:</label>
                              <select
                                className="form-control"
                                value={value.maLop}
                                onChange={(e) =>
                                  setValue({ ...value, maLop: e.target.value })
                                }
                              >
                                <option value="">Chọn Lớp</option>
                                {Class.map((classs) => (
                                  <option key={classs.id} value={classs.id}>
                                    {classs.tenLop}
                                  </option>
                                ))}
                              </select>
                          </div>
                        </div>
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                    <button onClick={handleSubmit}  className="btn add-new mr-2" type="button" data-toggle="tooltip" data-placement="top" title="In file">Lưu</button>
                    <CButton color="secondary" onClick={handleCloseModalss}>Đóng</CButton>
                </div>
            </div>
        </div>
    </div>
    <div className={`modal-backdrop fade ${showModalss ? 'show' : ''}`} style={{ display: showModalss ? 'block' : 'none' }}></div>


        
    <div className={`modal ${showModalssss ? 'show' : ''}`} tabIndex="-1" role="dialog" style={{ display: showModalssss ? 'block' : 'none' }}>
        <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content" >
                <div className="modal-header">
                    <h5 className="modal-title">Thông tin chi tiết sinh viên</h5>
                    <button type="button" className="close" onClick={handleCloseModalssss} aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                {selectedStudent && (
                    <div className='student-info'>
                       <div className="row">
                    <div className="col-md-6">
                      <div className='student-info'>
                        <div className="info-item">
                          <p><strong>MSSV:</strong> {selectedStudent.maSinhVien}</p>
                        </div>
                        <div className="info-item">
                          <p><strong>Họ và tên:</strong> {selectedStudent.hoTen}</p>
                        </div>
                        <div className="info-item">
                          <p><strong>Ngày sinh:</strong> {new Date(selectedStudent.ngaySinh).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
                        </div>
                        <div className="info-item">
                          <p><strong>Giới tính:</strong> {selectedStudent.gioiTinh}</p>
                        </div>
                        <div className="info-item">
                          <p><strong>Số điện thoại:</strong> {selectedStudent.soDienThoai}</p>
                        </div>
                        <div className="info-item">
                          <p><strong>Trình độ:</strong> {selectedStudent.trinhDo}</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className='student-info'>
                        <div className="info-item">
                          <p><strong>Email:</strong> {selectedStudent.email}</p>
                        </div>
                        <div className="info-item">
                          <p><strong>Địa chỉ:</strong> {selectedStudent.diaChi}</p>
                        </div>
                        <div className="info-item">
                          <p><strong>Mã lớp:</strong> {getStudentNameByIdsss(selectedStudent.maLop)}</p>
                        </div>
                        <div className="info-item">
                          <p><strong>Tên lớp:</strong> {getStudentNameById(selectedStudent.maLop)}</p>
                        </div>
                        <div className="info-item">
                          <p><strong>Niên khóa:</strong>{selectedStudent.nienKhoa}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                )}
                </div>
                <div className="modal-footer">
                    <CButton color="secondary" onClick={handleCloseModalssss}>Đóng</CButton>
                </div>
            </div>
        </div>
    </div>
    <div className={`modal-backdrop fade ${showModalssss ? 'show' : ''}`} style={{ display: showModalssss ? 'block' : 'none' }}></div>
        </CCardBody>
      </CCard>

       <ReactPaginate
        previousLabel={'<<'}
        nextLabel={'>>'}
        breakLabel={'...'}
        breakClassName={'break-me'}
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName={'pagination'}
        subContainerClassName={'pages pagination'}
        activeClassName={'active'}
      />
      <ToastContainer />
    </>
  )
}

export default Sinhvien
