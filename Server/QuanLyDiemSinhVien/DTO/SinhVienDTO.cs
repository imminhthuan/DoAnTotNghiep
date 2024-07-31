using System.ComponentModel.DataAnnotations;

namespace asd123.DTO;

public class SinhVienDTOs
{
    public List<CreateSinhVienDTO> SinhViens { get; set; }
}

public class SinhVienDTO
{
    public Guid Id { get; set; }

    [Required] [StringLength(12)] public string MaSinhVien { get; set; }

    public string HoTen { get; set; }
    public DateTime NgaySinh { get; set; }
    public string Email { get; set; }
    public string SoDienThoai { get; set; }
    public string DiaChi { get; set; }
    public Guid? MaLop { get; set; }
    public string GioiTinh { get; set; }
    public string TrinhDo { get; set; }
    public string NienKhoa { get; set; }
}

public class CreateSinhVienDTO
{
    [Required(ErrorMessage = "User Name is required")]
    public string Username { get; set; }

    [EmailAddress]
    [Required(ErrorMessage = "Email is required")]
    public string Email { get; set; }

    [StringLength(255)] public string? HoTen { get; set; }

    public DateTime NgaySinh { get; set; }

    [StringLength(255)] public string DiaChi { get; set; }

    [StringLength(15)] public string SoDienThoai { get; set; }
    [StringLength(10)] public string GioiTinh { get; set; }
    [StringLength(50)] public string TrinhDo { get; set; }

    [StringLength(10)] public string NienKhoa { get; set; }
    public Guid MaLop { get; set; }
}

public class UpdateSinhVienDTO
{
    public string? Username { get; set; }

    [EmailAddress] public string? Email { get; set; }

    [StringLength(255)] public string? HoTen { get; set; }

    public DateTime NgaySinh { get; set; }

    [StringLength(255)] public string? DiaChi { get; set; }

    [StringLength(15)] public string? SoDienThoai { get; set; }
    
    [StringLength(10)] public string? GioiTinh { get; set; }
    
    [StringLength(50)] public string? TrinhDo { get; set; }

    [StringLength(10)] public string? NienKhoa { get; set; }
    
    public Guid MaLop { get; set; }
}