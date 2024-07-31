using System.ComponentModel.DataAnnotations;

namespace asd123.Presenters.Student;

public class create_student_presenter
{
    [Required]
    public string Code { get; set; }
    [Required]
    public string Name { get; set; }
    [Required]
    public string Sex { get; set; }
    [Required]
    public DateOnly Dob { get; set; }
    [Required]
    public string HomeTown {  get; set; }
    [Required]
    public string ContactNumber { get; set; }
    [Required]
    public int ClassId { get; set; }
}