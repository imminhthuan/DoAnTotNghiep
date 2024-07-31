using System.ComponentModel.DataAnnotations;

namespace asd123.DTO;

public class CreateChuyenNganhDto
{
    [Required]
    [StringLength(255)]
    public string TenChuyenNganh { get; set; }

    public Guid MaKhoa { get; set; }
}
