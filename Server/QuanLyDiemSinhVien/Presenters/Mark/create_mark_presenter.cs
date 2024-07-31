using System.ComponentModel.DataAnnotations;

namespace asd123.Presenters.Mark;

public class create_mark_presenter
{
    [Required] public int StudentId { get; set; }
    [Required] public int SubjectId { get; set; }
    [Required] public int Midterm { get; set; }
    [Required] public int Final_Exam { get; set; }
    [Required] public int Attendance { get; set; }
}