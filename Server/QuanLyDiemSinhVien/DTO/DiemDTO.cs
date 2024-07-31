namespace asd123.DTO;

public class NhapDiemForClassDTO
{
    public Guid MonHocId { get; set; }
    public List<StudentScoreDTO> StudentScores { get; set; }
}

public class StudentScoreDTO
{
    public Guid SinhVienId { get; set; }
    public DiemDTO Diem { get; set; }
}

public class DiemDTO
{
    public float? DiemChuyenCan { get; set; }
    public float? DiemKiemTraGiuaKi { get; set; }
    public float? DiemThi { get; set; }
}