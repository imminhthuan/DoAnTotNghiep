using System;
using System.ComponentModel.DataAnnotations.Schema;
using asd123.Model;

public class Diem : BaseSchema
{
    public Guid MaSinhVien { get; set; }

    [ForeignKey("MaSinhVien")] public SinhVien SinhVien { get; set; }

    public Guid MaMonHoc { get; set; }

    [ForeignKey("MaMonHoc")] public MonHoc MonHoc { get; set; }

    public float? DiemChuyenCan { get; set; }
    public float? DiemKiemTraGiuaKi { get; set; }
    public float? DiemThi { get; set; }

    [NotMapped]
    public float DiemTongKet
    {
        get
        {
            // Calculate DiemTongKet based on your business logic
            // Example: Weighted average of different components
            float totalScore = 0;
            float totalWeight = 0;

            if (DiemChuyenCan.HasValue)
            {
                totalScore += DiemChuyenCan.Value * WeightChuyenCan;
                totalWeight += WeightChuyenCan;
            }


            if (DiemKiemTraGiuaKi.HasValue)
            {
                totalScore += DiemKiemTraGiuaKi.Value * WeightKiemTraGiuaKi;
                totalWeight += WeightKiemTraGiuaKi;
            }

            if (DiemThi.HasValue)
            {
                totalScore += DiemThi.Value * WeightThi;
                totalWeight += WeightThi;
            }

            // Avoid division by zero
            if (totalWeight > 0)
            {
                return totalScore / totalWeight;
            }
            else
            {
                return 0;
            }
        }
        set { } // Optional setter, depending on your needs
    }

    // Example weights for different components (adjust as per your grading system)
    private const float WeightChuyenCan = 0.1f;
    private const float WeightBaiTap = 0.2f;
    private const float WeightThucHanh = 0.3f;
    private const float WeightKiemTraGiuaKi = 0.2f;
    private const float WeightThi = 0.2f;
}