namespace asd123.DTO;

public class BaoCaoThanhTichRequest
{
    public Guid? LopId { get; set; }
    public Guid? ChuyenNganhId { get; set; }
    public Guid? KhoaId { get; set; }
    public string ThanhTich { get; set; } // Có thể là "Cao", "Thấp", hoặc một tiêu chí đánh giá khác tuỳ ý.
    public DateTime? ThoiGianBatDau { get; set; }
    public DateTime? ThoiGianKetThuc { get; set; }
}