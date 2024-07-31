import axios from "axios";

const API = axios.create({
  baseURL: 'http://13.213.29.230:8001/',
  validateStatus: function (status) {
    return status >= 200 && status < 300; // mặc định
  }
});

API.interceptors.request.use((req) => {
  const user = localStorage.getItem("user");
  if (user) {
    const token = JSON.parse(user).token;
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Admin

export const login = async(formData) =>{
  
  return await API.post("/api/Authenticate/login", formData);
}
export const register = async(formData) =>{
  
  return await API.post("/api/Authenticate/register", formData);
  //console.log("formData"); 
} 

export const changepassword = async(formData) => {
  return await API.post("/api/Authenticate/change-password", formData);
}

export const resetpassword = async(formData) => {
  return await API.put("/api/Authenticate/ResetPassword", formData);
}

export const bysinhvienlogin = () => API.get("/api/SinhVien/GetProfileBySinhVienLogin");


export const GetAllDiemBySinhVienLogin = () => API.get("/api/Diem/GetAllDiemBySinhVienLogin");

export const getAllClass = () => API.get("/api/Lop");
export const getAllDepartment = () => API.get("/api/Khoa");
export const getDepartmentByName = (id) => API.get(`/api/Department/get_department_by_id/${id}`);
export const getAllMajor = () => API.get("/api/ChuyenNganh");
export const getMajor = () => API.get("/api/Major/get_major_by-id");
export const getAllStudent = () => API.get("/api/SinhVien/GetAllStudents");
export const getAllSubject = () => API.get("/api/MonHoc")

export const getAllMarkStudent = (sinhVienId) => API.get(`/api/Diem/GetAllDiemBySinhVienId/${sinhVienId}`);
export const getMajorDTB = (id) => API.get(`/api/Diem/TinhDiemTB/${id}`);

export const addClass = (classs) => API.post("/api/Lop", classs);
export const addDepartment = (department) => API.post("/api/Khoa", department); 
export const addMajor = (major) => API.post("/api/chuyenNganh", major);
export const addStudent = (student) => API.post("/api/SinhVien", student);
export const addAllStudent = (students) => API.post("/api/SinhVien/NhapNhieuSinhVien", students);
export const addSubject = (subject) => API.post("/api/MonHoc", subject);
export const addMark = (mark) => API.post("/api/Diem/NhapDiemForClass", mark);

export const updateClass = (id,updateClass) => API.put(`/api/Lop/${id}`, updateClass);
export const updateDepartment = (id,updateDepartment) => API.put(`/api/Khoa/${id}`, updateDepartment)
export const updateMajor = (id,updateMajor) => API.put(`/api/chuyenNganh/${id}`, updateMajor);
export const updateStudent = (id,updatedStudent) => API.put(`/api/SinhVien/${id}`, updatedStudent);
export const updateSubject = (id,updateSubject) => API.put(`/api/MonHoc/${id}`, updateSubject);
export const updateMarks = (diemId, updateMark) => API.put(`/api/Diem/UpdateDiem/${diemId}`, updateMark);

export const deleteClass = (id, data) => API.delete(`/api/Lop/${id}`, data);
export const deleteDepartment = (id, data) => API.delete(`/api/Khoa/${id}`, data);
export const deleteMajor = (id, data) => API.delete(`/api/chuyenNganh/${id}`, data);
export const deleteStudent = (id,data) => API.delete(`/api/SinhVien/${id}`, data);
export const deleteSubject = (id,data) => API.delete(`/api/MonHoc/${id}`, data);
export const deleteMark = (sinhVienId, monHocId, data) => API.delete(`/api/Diem/DeleteDiem/${sinhVienId}/${monHocId}`, data);
