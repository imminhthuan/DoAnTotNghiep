namespace asd123.DTO;

public class LopDTO
{
    public Guid Id { get; set; }
    public string MaLop { get; set; }
    public string TenLop { get; set; }
    public Guid MaChuyenNganh { get; set; }
    public string TenChuyenNganh { get; set; } // Thêm nếu muốn trả về tên chuyên ngành trong cùng một DTO
}
