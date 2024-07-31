using System.ComponentModel.DataAnnotations;

namespace asd123.DTO;

public class CreateLopDTO
{
    [Required]
    [StringLength(255)]
    public string TenLop { get; set; }
    public string MaLop { get; set; }
    public Guid MaChuyenNganh { get; set; }
}
