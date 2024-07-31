using System.Globalization;
using asd123.DTO;
using asd123.Model;
using CsvHelper;
using CsvHelper.Configuration;
using Microsoft.EntityFrameworkCore;

namespace asd123.Services;

public interface IDiem
{
    Task<NhapDiemResponse> NhapDiemAsync(Guid sinhVienId, Guid monHocId, DiemDTO diemDTO);
    Task UpdateDiemAsync(Guid diemId, DiemDTO diemDTO);
    Task DeleteDiemAsync(Guid sinhVienId, Guid monHocId);
    Task<IEnumerable<Diem>> GetAllDiemBySinhVienIdAsync(Guid sinhVienId);
    Task<IEnumerable<Diem>> GetAllDiemByMonHocIdAsync(Guid monHocId);
    Task<TinhDiemTBResponse> TinhDiemTBAsync(Guid sinhVienId);
    Task<bool> NhapDiemForClassAsync(Guid monHocId, List<StudentScoreDTO> studentScores);
}

public class DiemService : IDiem
{
    private readonly ApplicationDbContext _context;

    public DiemService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<NhapDiemResponse> NhapDiemAsync(Guid sinhVienId, Guid monHocId, DiemDTO diemDTO)
    {
        // Tạo một thực thể Diem mới dựa trên DiemDTO
        var diem = new Diem
        {
            MaSinhVien = sinhVienId,
            MaMonHoc = monHocId,
            DiemChuyenCan = diemDTO.DiemChuyenCan,
            DiemKiemTraGiuaKi = diemDTO.DiemKiemTraGiuaKi,
            DiemThi = diemDTO.DiemThi
        };

        await _context.Diems.AddAsync(diem);
        await _context.SaveChangesAsync();

        return new NhapDiemResponse
        {
            SinhVienId = sinhVienId,
            MonHocId = monHocId,
            Diem = diemDTO
        };
    }

    public async Task UpdateDiemAsync(Guid diemId, DiemDTO diemDTO)
    {
        // Tìm Diem cụ thể bằng SinhVienId và MonHocId
        var existingDiem =
            await _context.Diems.FirstOrDefaultAsync(d => d.Id == diemId);

        // Cập nhật thông tin điểm
        if (existingDiem != null)
        {
            existingDiem.DiemChuyenCan = diemDTO.DiemChuyenCan;
            existingDiem.DiemKiemTraGiuaKi = diemDTO.DiemKiemTraGiuaKi;
            existingDiem.DiemThi = diemDTO.DiemThi;

            _context.Diems.Update(existingDiem);
            await _context.SaveChangesAsync();
        }
    }

    public async Task DeleteDiemAsync(Guid sinhVienId, Guid monHocId)
    {
        var diemToRemove = await _context.Diems
            .FirstOrDefaultAsync(d => d.MaSinhVien == sinhVienId && d.MaMonHoc == monHocId);

        if (diemToRemove != null)
        {
            _context.Diems.Remove(diemToRemove);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<IEnumerable<Diem>> GetAllDiemBySinhVienIdAsync(Guid sinhVienId)
    {
        return await _context.Diems
            .Where(d => d.MaSinhVien == sinhVienId)
            // .Include(s => s.SinhVien)
            // .Include(m => m.MonHoc)
            .ToListAsync();
    }

    public async Task<IEnumerable<Diem>> GetAllDiemByMonHocIdAsync(Guid monHocId)
    {
        return await _context.Diems
            .Where(d => d.MaMonHoc == monHocId)
            // .Include(s => s.SinhVien)
            // .Include(m => m.MonHoc)
            .ToListAsync();
    }

    public async Task<TinhDiemTBResponse> TinhDiemTBAsync(Guid sinhVienId)
    {
        // Giả định rằng chúng ta đã có một phương thức để tính điểm trung bình
        // Tính điểm trung bình theo các quy định
        var diems = await _context.Diems
            .Where(d => d.MaSinhVien == sinhVienId)
            .ToListAsync();

        // Giả định tính điểm trung bình từ các component điểm đã có
        float? diemTB = CalculateDiemTB(diems);

        return new TinhDiemTBResponse
        {
            SinhVienId = sinhVienId,
            DiemTrungBinhMon = diemTB.HasValue ? diemTB.Value : 0
        };
    }

    private float? CalculateDiemTB(IEnumerable<Diem> diems)
    {
        if (diems == null || !diems.Any())
        {
            return null; // Return null or handle empty collection based on your business logic
        }

        float totalScore = 0;
        int totalComponents = 0;

        foreach (var diem in diems)
        {
            // Consider how to weigh each component based on your grading policy
            // For example, if all components are equally weighted:
            if (diem.DiemChuyenCan.HasValue)
            {
                totalScore += diem.DiemChuyenCan.Value;
                totalComponents++;
            }

            if (diem.DiemKiemTraGiuaKi.HasValue)
            {
                totalScore += diem.DiemKiemTraGiuaKi.Value;
                totalComponents++;
            }

            if (diem.DiemThi.HasValue)
            {
                totalScore += diem.DiemThi.Value;
                totalComponents++;
            }
        }

        if (totalComponents > 0)
        {
            // Calculate the average score
            float averageScore = totalScore / totalComponents;
            return averageScore;
        }
        else
        {
            return null; // Handle case where no valid components were found
        }
    }

    public async Task<bool> NhapDiemForClassAsync(Guid monHocId, List<StudentScoreDTO> studentScores)
    {
        foreach (var studentScore in studentScores)
        {
            var sinhVienId = studentScore.SinhVienId;
            var diemDTO = studentScore.Diem;

            var sinhVien = await _context.SinhViens.FindAsync(sinhVienId);
            var monHoc = await _context.MonHocs.FindAsync(monHocId);
            if (sinhVien == null || monHoc == null)
            {
                continue; // Skip if student or subject not found
            }

            var diem = new Diem
            {
                MaSinhVien = sinhVienId,
                MaMonHoc = monHocId,
                DiemChuyenCan = diemDTO.DiemChuyenCan,
                DiemKiemTraGiuaKi = diemDTO.DiemKiemTraGiuaKi,
                DiemThi = diemDTO.DiemThi,
            };

            _context.Diems.Add(diem);
        }

        await _context.SaveChangesAsync();
        return true;
    }
}