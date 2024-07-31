using System.ComponentModel.DataAnnotations;

namespace asd123.DTO;

public class MonHocDTO
{
    public Guid Id { get; set; }
    public string TenMonHoc { get; set; }
    public int SoTinChi { get; set; }
    public Guid MaChuyenNganh { get; set; }
}

public class CreateMonHocDTO
{
    [Required]
    [StringLength(255)]
    public string TenMonHoc { get; set; }

    public int SoTinChi { get; set; }

    [Required]
    public Guid MaChuyenNganh { get; set; }
}

public class UpdateMonHocDTO
{
    [Required]
    [StringLength(255)]
    public string TenMonHoc { get; set; }

    public int SoTinChi { get; set; }

    [Required]
    public Guid MaChuyenNganh { get; set; }
}