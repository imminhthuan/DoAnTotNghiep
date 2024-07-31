using asd123.Model;
using System.ComponentModel.DataAnnotations;

namespace asd123.Presenters.Class
{
    public class UpdateClassPresenter
    {
        [Required]
        public string Code { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public int MajorId { get; set; }
    }
}
