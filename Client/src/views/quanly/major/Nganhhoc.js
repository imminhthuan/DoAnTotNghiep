
import { CCard, CCardHeader, CCardBody } from '@coreui/react'
import { DocsLink } from 'src/components'
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMajor, deleteMajor,getAllDepartment,getAllMajor, updateMajor  } from "../../../redux/actions/adminAction";
import { ADD_MAJOR, DELETE_DEPARTMENT, SET_ERRORS } from "../../../redux/actionTypes";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactPaginate from "react-paginate";
import '../mark/mark.css';
import './major.css';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const Nganhhoc = () => {
  const dispatch = useDispatch();
  const [checkedValue, setCheckedValue] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const Majors = useSelector((state) => state.admin.allMajor) || [];
  const departments = useSelector((state) => state.admin.allDepartment) || [];
  const Subjects = useSelector((state) => state.admin.allSubject) || [];
  const store = useSelector((state) => state);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [search, setSearch] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMajorId, setCurrentMajorId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [value, setValue] = useState({
    tenChuyenNganh: "",
    maKhoa: "",
  });

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    if (Object.keys(store.errors).length !== 0) {
      setError(store.errors);
      setValue({
        tenChuyenNganh: "",
        maKhoa: "",
      });
    }
  }, [store.errors]);

  useEffect(() => {
    if (store.errors || store.admin.majorAdd) {
      setLoading(false);
      if (store.admin.majorAdd) {
        setValue({
          tenChuyenNganh: "",
          maKhoa: "",
        });

        dispatch({ type: SET_ERRORS, payload: {} });
        dispatch({ type: ADD_MAJOR, payload: false });
      }
    } else {
      setLoading(true);
    }
  }, [store.errors, store.admin.majorAdd]);

  useEffect(() => {
    setLoading(true);
    dispatch(getAllMajor());
    dispatch(getAllDepartment());
  }, [dispatch]);

  useEffect(() => {
    if (Object.keys(store.errors).length !== 0) {
      setError(store.errors);
      setLoading(false);
    }
  }, [store.errors]);

  useEffect(() => {
    if (store.departmentDeleted) {
      setLoading(false);
      setCheckedValue([]);
      dispatch(getAllMajor());
      dispatch({ type: DELETE_DEPARTMENT, payload: false });
    }
  }, [store.departmentDeleted, dispatch]);

  useEffect(() => {
    if (Majors?.length !== 0) {
      setLoading(false);
    }
  }, [Majors]);

  useEffect(() => {
    dispatch({ type: SET_ERRORS, payload: {} });
  }, [dispatch]);

  const handleInputChange = (e) => {
    const tempCheck = checkedValue;
    let index;
    if (e.target.checked) {
      tempCheck.push(e.target.value);
    } else {
      index = tempCheck.indexOf(e.target.value);
      tempCheck.splice(index, 1);
    }
    setCheckedValue([...tempCheck]);
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError({});

    if (!value.tenChuyenNganh || !value.maKhoa) {
      toast.error("Vui lòng điền đầy đủ thông tin.");
      setLoading(false);
      return;
    }

    const majors = Majors.find((major) => major.tenChuyenNganh == value.tenChuyenNganh)
    if(majors){
      toast.error("Chuyên ngành đã tồn tại!")
      return;
    }
    
    const formData = {
      tenChuyenNganh: value.tenChuyenNganh,
      maKhoa: value.maKhoa,
    };
  
    try {
      if (isEditing) {
        // Đây là trường hợp chỉnh sửa
        await dispatch(updateMajor(currentMajorId, formData));
        toast.success("Chỉnh sửa ngành học thành công!");
      } else {
        // Đây là trường hợp thêm mới
        await dispatch(addMajor(formData));
        toast.success("Thêm ngành học thành công!");
      }
      setIsEditing(false);
      setShowAddForm(false);/// Ẩn modal sau khi thêm thành công
      setValue({ tenChuyenNganh: "", maKhoa: ""});
      // Tải lại trang để cập nhật danh sách lớp
      dispatch(getAllMajor());
    } catch (error) {
      console.error("Error adding class:", error);
      setError({ backendError: "Error adding class" });
      setLoading(false);
    }
  };
  const handleAddButtonClick = () => {
    setIsEditing(false);
    setValue({ tenChuyenNganh: "", maKhoa: ""});
    setShowAddForm(true);
  };

  const handleEditButtonClick = (dep) => {
    setIsEditing(true);
    setCurrentMajorId(dep.id);
    setValue({ tenChuyenNganh: dep.tenChuyenNganh, maKhoa: dep.maKhoa});
  };

  const handleDeleteButtonClick = async (id) => {
    try {

      const Subjectss = Subjects.filter(major => major.maChuyenNganh === id);
      if (Subjectss.length > 0) {
        toast.error("Chuyên ngành này đã có môn học, không thể xóa.");
        return; // Dừng hàm nếu có học sinh trong lớp
      }
      await dispatch(deleteMajor(id));
      toast.success("Xóa thành công!");
      dispatch(getAllMajor()); // Sau khi xóa, cập nhật lại danh sách lớp học
      dispatch(getAllDepartment());
    } catch (error) {
      console.error("Error deleting class:", error);
      setLoading(false);
    }
  };

  const handdelete = (e) => {
    setShowAddForm(false);
  }

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const getDeparmentNameById = (departmentId) => {
    if (!departments || departments.length === 0) return 'N/A'; // Handle case where majors is undefined or empty
    const department = departments.find((department) => department.id === departmentId);
    return department ? department.tenKhoa : 'N/A';
  };

  const filteredMajor = useMemo(() => {
    const uniqueFilteredMajor = [];
    const addedMajor = {};
    
    Majors.forEach((dep) => {
      const matchQuery = dep.tenChuyenNganh.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getDeparmentNameById(dep.maKhoa).toLowerCase().includes(searchQuery.toLowerCase());
      
      if (matchQuery && !addedMajor[dep.id]) {
        uniqueFilteredMajor.push(dep);
        addedMajor[dep.id] = true;
      }
    });
  
    return uniqueFilteredMajor;
  }, [Majors, searchQuery]);

  const offset = currentPage * itemsPerPage;
  const currentPageData = useMemo(() => filteredMajor.slice(offset, offset + itemsPerPage), [filteredMajor, offset]);
  const pageCount = Math.ceil(filteredMajor.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage + 1;

  const exportToExcel = async () => {
    // Tạo workbook và worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Chuyên ngành');

    // Định nghĩa header và dữ liệu
    const headers = ['STT', 'Chuyên ngành', 'Khoa'];
    const dataToExport = Majors.map((major, index) => [
        index + 1,
        major.tenChuyenNganh,
        getDeparmentNameById(major.maKhoa)
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
    saveAs(dataBlob, 'Chuyên Ngành.xlsx');
};

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>
          <div className='row'>
            <div className='col-lg-4'>
              Chuyên ngành
            </div>
            <div className='col-lg-8 search-container'>
              <input type="text" id="myInput" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Tìm kiếm..." className="search-input"/>
              <button onClick={exportToExcel}  className="btn add-new mr-2" type="button" data-toggle="tooltip" data-placement="top" title="In file"><i className="fas fa-download mr-2 mt-1"></i>Xuất file</button>  
              <button onClick={handleAddButtonClick} className="nv btn add-news" type="button" data-toggle="tooltip" data-placement="top"
                      title="Thêm Ngành"><i className="fas fa-book mr-2 mt-1"></i>Nhập chuyên ngành</button>  
            </div>
          </div>
        </CCardHeader>
        <CCardBody>
        <form >
                    <table className="table table-bordered">
                      <thead className="thead-dark">
                        <tr>
                          {/* <th>Select</th> */}
                          <th className="text-center">STT</th>  
                          <th className="text-center">Chuyên ngành</th>
                          <th className="text-center">Khoa</th>
                          <th className="text-center">Chức năng</th>
                        </tr>
                      </thead>
                      <tbody>
                      {showAddForm && (
                          <tr>
                            <td></td>
                            {/* <td>
                              <input
                                onChange={handleInputChange}
                                className="custom-checkbox"
                                type="checkbox"
                              />
                            </td> */}
                            <td>
                              <input type="text" className="form-control" id="tenChuyenNganh" name="tenChuyenNganh" placeholder="Nhập mã ngành" value={value.tenChuyenNganh} onChange={(e) => setValue({ ...value, tenChuyenNganh: e.target.value })} />
                            </td>
                            <td>
                              <select
                                className="form-control"
                                value={value.maKhoa}
                                onChange={(e) =>
                                  setValue({ ...value, maKhoa: e.target.value })
                                }
                              >
                                <option value="">Chọn Khoa</option>
                                {departments.map((department) => (
                                  <option key={department.id} value={department.id}>  
                                    {department.tenKhoa}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="text-center">
                              <button onClick={handleSubmit} className="btn btn-success mr-4 cursor-pointer icon-button">Lưu</button>
                              <button onClick={handdelete} className="btn btn-danger cursor-pointer icon-button">Xóa</button>
                            </td>
                          </tr>
                        )}
                      {currentPageData && currentPageData.length > 0 ? (
                              currentPageData.map((dep, idx) => (
                                <tr key={idx}>
                                  {/* <td>
                                    <input
                                      onChange={handleInputChange}
                                      value={dep._id}
                                      className=""
                                      type="checkbox"
                                    />
                                  </td> */}
                                  <td className="text-center">{startIndex + idx}</td>
                                  <td className="text-left">{isEditing && currentMajorId === dep.id ? (
                                  <input className="form-control" type="text" value={value.tenChuyenNganh} onChange={(e) => setValue({ ...value, tenChuyenNganh: e.target.value })} />
                                  ) : (
                                    dep.tenChuyenNganh
                                  )}</td>
                                  <td className="text-left">{isEditing && currentMajorId === dep.id ? (
                                  <select className="form-control" value={value.maKhoa} onChange={(e) => setValue({ ...value, maKhoa: e.target.value })}>
                                    <option value="">Chọn khoa</option>
                                    {departments.map((department) => (
                                      <option key={department.id} value={department.id}>{department.tenKhoa}</option>
                                    ))}
                                  </select>
                                ) : (
                                  getDeparmentNameById(dep.maKhoa)
                                )}</td>
                                  <td className="text-center">
                                    {isEditing && currentMajorId === dep.id ? (
                                      <button onClick={handleSubmit} className="btn btn-success mr-3 cursor-pointer icon-button">Lưu</button>
                                    ) : (
                                      <button className="btn btn-warning mr-3 cursor-pointer icon-button" onClick={() => handleEditButtonClick(dep)}>Sửa</button>
                                    )}
                                    <button className="btn btn-danger cursor-pointer icon-button" onClick={() => handleDeleteButtonClick(dep.id)}>Xóa</button>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="6" className="text-center">Không có dữ liệu ngành học.</td>
                              </tr>
                            )}

                      </tbody>
                    </table>
                  </form>
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

export default Nganhhoc
