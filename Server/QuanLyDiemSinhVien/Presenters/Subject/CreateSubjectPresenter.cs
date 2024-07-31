using System.ComponentModel.DataAnnotations;

namespace asd123.Presenters.Subject
{
    public class CreateSubjectPresenter
    {
        [Required]
        public string Code { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public int TotalCreadits { get; set; }
        [Required]
        public int MajorId { get; set; }
    }
}
