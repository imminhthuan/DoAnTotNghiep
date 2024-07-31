using System.ComponentModel.DataAnnotations;

namespace asd123.Presenters
{
    public class RegisterModel
    {
        [Required(ErrorMessage = "User Name is required")]
        public string Username { get; set; }

        [EmailAddress]
        [Required(ErrorMessage = "Email is required")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Password is required")]
        public string Password { get; set; }

        [StringLength(255)] public string? HoTen { get; set; }

        public DateTime NgaySinh { get; set; }

        [StringLength(255)] public string? DiaChi { get; set; }

        [StringLength(15)] public string? SoDienThoai { get; set; }
        [StringLength(10)] public string? GioiTinh { get; set; }
    }
}