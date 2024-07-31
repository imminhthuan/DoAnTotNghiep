using System.ComponentModel.DataAnnotations;

namespace asd123.Presenters.Department
{
    public class KhoaPresenter
    {
        [Required(ErrorMessage = "Tên khoa là bắt buộc")]
        [StringLength(255, ErrorMessage = "Tên khoa không vượt quá 255 ký tự")]
        public string TenKhoa { get; set; }
    }

}
