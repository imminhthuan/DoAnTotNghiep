namespace asd123.DTO;

public class ThongKeSinhVienResponse
{
    public Guid LopId { get; set; }
    public string TenLop { get; set; }
    public int SoLuongSinhVien { get; set; }
    public Guid ChuyenNganhId { get; set; }
    public string TenChuyenNganh { get; set; }
    public Guid KhoaId { get; set; }
    public string TenKhoa { get; set; }
}