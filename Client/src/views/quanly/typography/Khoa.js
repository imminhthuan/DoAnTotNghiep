import { CCard, CCardHeader, CCardBody } from '@coreui/react'
import { DocsLink } from 'src/components'
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addDepartment, deleteDepartment, getAllDepartment , updateDepartment, getAllMajor} from "../../../redux/actions/adminAction";
import { ADD_DEPARTMENT, DELETE_DEPARTMENT, SET_ERRORS } from "../../../redux/actionTypes";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactPaginate from "react-paginate";
import '../mark/mark.css';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import './khoa.css';




const Khoa = () => {
  const dispatch = useDispatch();
  const [checkedValue, setCheckedValue] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const departments = useSelector((state) => state.admin.allDepartment) || [];
  const Majors = useSelector((state) => state.admin.allMajor) || [];
  const store = useSelector((state) => state);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [search, setSearch] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentDeparmentId, setCurrentDeparmentId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [value, setValue] = useState({
    tenKhoa: "",
  });

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;




  useEffect(() => {
    if (Object.keys(store.errors).length !== 0) {
      setError(store.errors);
      setValue({
        tenKhoa: "",
      });
    }
  }, [store.errors]);

  useEffect(() => {
    if (store.errors || store.admin.departmentAdd) {
      setLoading(false);
      if (store.admin.departmentAdd) {
        setValue({
          tenKhoa: "",
        });

        dispatch({ type: SET_ERRORS, payload: {} });
        dispatch({ type: ADD_DEPARTMENT, payload: false });
      }
    } else {
      setLoading(true);
    }
  }, [store.errors, store.admin.departmentAdd]);

  useEffect(() => {
    setLoading(true);
    dispatch(getAllDepartment());
    dispatch(getAllMajor());
  }, [dispatch]);

  useEffect(() => {
    if (Object.keys(store.errors).length !== 0) {
      setError(store.errors);
      setLoading(false);
    }
  }, [store.errors]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError({});

    if (!value.tenKhoa) {
      toast.error("Vui lòng điền đầy đủ thông tin.");
      setLoading(false);
      return;
    }

    const formData = {
      tenKhoa: value.tenKhoa,
    };
  
    try {
      if (isEditing) {
        // Đây là trường hợp chỉnh sửa
        await dispatch(updateDepartment(currentDeparmentId, formData));
        toast.success("Chỉnh sửa khoa thành công!");
      } else {
        // Đây là trường hợp thêm mới
        await dispatch(addDepartment(formData));
        toast.success("Thêm khoa thành công!");
      }
      setIsEditing(false);
      setShowAddForm(false);// Ẩn modal sau khi thêm thành công
      setValue({ tenKhoa: ""});
      console.log("đa" , formData)
      dispatch(getAllDepartment());
      // Tải lại trang để cập nhật danh sách lớp
     //window.location.reload();
    } catch (error) {
      console.error("Error adding class:", error);
      setError({ backendError: "Error adding class" });
      setLoading(false);
    }
  };

  
  const handleAddButtonClick = () => {
    setIsEditing(false);
    setValue({ tenKhoa: ""});
    setShowAddForm(true);
  };

  const handleEditButtonClick = (dep) => {
    setIsEditing(true);
    setCurrentDeparmentId(dep.id);
    setValue({ tenKhoa: dep.tenKhoa});
  };


  useEffect(() => {
    if (departments?.length !== 0) {
      setLoading(false);
    }
  }, [departments]);

  useEffect(() => {
    dispatch({ type: SET_ERRORS, payload: {} });
  }, [dispatch]);

  const navigate = useNavigate();


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

  
  const handdelete = (e) => {
    setShowAddForm(false);
  }


  const handleDeleteButtonClick = async (id) => {
    try {
      // Lấy danh sách chuyên ngành của khoa
      const Majorss = Majors.filter(major => major.maKhoa === id);
      if (Majorss.length > 0) {
        toast.error("Khoa này đã có chuyên ngành, không thể xóa.");
        return; // Dừng hàm nếu có học sinh trong lớp
      }
      await dispatch(deleteDepartment(id));
      toast.success("Xóa thành công!");
      dispatch(getAllDepartment());
    } catch (error) {
      console.error("Error deleting department:", error);
      setLoading(false);
    }
  };


  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  
  const offset = currentPage * itemsPerPage;
  const filteredDepartment = departments.filter(department => department.tenKhoa.toLowerCase().includes(searchQuery.toLowerCase()));
  const currentPageData = filteredDepartment.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(filteredDepartment.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage + 1;


  const exportToExcel = async () => {
    // Tạo workbook và worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Khoa');

    // Định nghĩa header và dữ liệu
    const headers = ['STT', 'Khoa'];
    const dataToExport = departments.map((department, index) => [
        index + 1,
        department.tenKhoa,
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
    saveAs(dataBlob, 'Khoa.xlsx');
};



  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>
          <div className='row'>
            <div className='col-lg-6'>
              Khoa
            </div>
            <div className="search-container col-lg-6">
              <input type="text" id="myInput" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Tìm kiếm..." className="search-input"/>
              <button onClick={exportToExcel} className="btn add-new mr-2" type="button" data-toggle="tooltip" data-placement="top"title="In file"><i className="fas fa-download  mr-2 mt-1"></i>Xuất file</button>
            
              <button onClick={handleAddButtonClick} className="btn add-newss" type="button" data-toggle="tooltip" data-placement="top" title="Nhập khoa"> <i className="fas fa-plus-circle mr-2 mt-1"></i>Nhập khoa</button>  
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
                              <input type="text" className="form-control" id="tenKhoa" name="tenKhoa" placeholder="Nhập mã khoa..." value={value.tenKhoa} onChange={(e) => setValue({ ...value, tenKhoa: e.target.value })} />
                            </td>
                            <td className="text-center">
                              <button onClick={handleSubmit} className="btn btn-success mr-3 cursor-pointer icon-button">Lưu</button>
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
                                  <td className="text-left">{isEditing && currentDeparmentId === dep.id ? (
                                  <input className="form-control" type="text" value={value.tenKhoa} onChange={(e) => setValue({ ...value, tenKhoa: e.target.value })} />
                                  ) : (
                                    dep.tenKhoa
                                  )}</td>
                                  <td className="text-center">
                                    {isEditing && currentDeparmentId === dep.id ? (
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
                                <td colSpan="3" className="text-center">Không tìm thấy khoa.</td>
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

export default Khoa
