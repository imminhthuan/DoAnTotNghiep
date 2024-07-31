using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace asd123.Model
{
    public class SinhVien : IdentityUser<Guid>
    {
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public SinhVien()
        {
            CreatedAt = DateTime.Now;
            UpdatedAt = DateTime.Now;
        }

        [StringLength(20)] public string MaSinhVien { get; set; }

        [StringLength(255)] public string HoTen { get; set; }

        public DateTime NgaySinh { get; set; }

        [StringLength(255)] public string DiaChi { get; set; }

        [StringLength(15)] public string SoDienThoai { get; set; }
        [StringLength(10)] public string GioiTinh { get; set; }

        [StringLength(50)] public string TrinhDo { get; set; }

        [StringLength(10)] public string NienKhoa { get; set; }

        public Guid? MaLop { get; set; }

        [ForeignKey("MaLop")] public Lop Lop { get; set; }

        public ICollection<Diem> Diems { get; set; }

        public void GenerateMaSinhVien()
        {
            var initials = GetInitials(HoTen);
            var birthDate = NgaySinh.ToString("yyyyMMdd");
            var uniquePart = DateTime.Now.ToString("HHmmssfffffff"); // Giờ, phút, giây, nanosecond
            MaSinhVien = $"{initials}{uniquePart}";
        }

        private string GetInitials(string hoTen)
        {
            var parts = hoTen.Split(' ');
            var initials = string.Empty;

            foreach (var part in parts)
            {
                if (!string.IsNullOrEmpty(part))
                {
                    initials += part[0];
                }
            }

            return initials.ToUpper();
        }

    }
}