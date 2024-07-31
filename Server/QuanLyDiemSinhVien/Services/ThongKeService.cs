using asd123.DTO;
using asd123.Model;
using Microsoft.EntityFrameworkCore;

namespace asd123.Services;

public interface IThongKeService
{
    Task<IEnumerable<ThongKeSinhVienResponse>> ThongKeSinhVienAsync(ThongKeRequest request);
    Task<IEnumerable<BaoCaoDiemResponse>> BaoCaoDiemAsync(BaoCaoDiemRequest request);
    Task<IEnumerable<SinhVienThanhTichResponse>> BaoCaoThanhTichAsync(BaoCaoThanhTichRequest request);
}

public class ThongKeService : IThongKeService
{
    private readonly ApplicationDbContext _context;

    public ThongKeService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<ThongKeSinhVienResponse>> ThongKeSinhVienAsync(ThongKeRequest request)
    {
        // Hãy thực hiện truy vấn lên cơ sở dữ liệu để thu thập và tính toán thông tin cần thiết
        // Code dưới đây chỉ là pseudo-code và cần được điều chỉnh phù hợp với kiến trúc của ứng dụng của bạn
        var query = _context.Lops.AsQueryable();

        if (request.LopId.HasValue)
        {
            query = query.Where(l => l.Id == request.LopId.Value);
        }

        if (request.KhoaId.HasValue)
        {
            query = query.Where(l => l.ChuyenNganh.MaKhoa == request.KhoaId.Value);
        }

        if (request.ChuyenNganhId.HasValue)
        {
            query = query.Where(l => l.MaChuyenNganh == request.ChuyenNganhId.Value);
        }

        // Đơn giản hóa, không tính toán chi tiết
        var result = await query.Select(l => new ThongKeSinhVienResponse
        {
            LopId = l.Id,
            TenLop = l.TenLop,
            SoLuongSinhVien = l.SinhViens.Count,
            ChuyenNganhId = l.MaChuyenNganh,
            TenChuyenNganh = l.ChuyenNganh.TenChuyenNganh,
            // Giả định có khoaId và tenKhoa từ chuyên ngành
            KhoaId = l.ChuyenNganh.MaKhoa,
            TenKhoa = l.ChuyenNganh.Khoa.TenKhoa
        }).ToListAsync();

        return result;
    }

    public async Task<IEnumerable<BaoCaoDiemResponse>> BaoCaoDiemAsync(BaoCaoDiemRequest request)
    {
        var diems = await _context.Diems
            .Where(d => d.MaMonHoc == request.MonHocId && d.SinhVien.Lop.ChuyenNganh.MaKhoa == request.KhoaHocId)
            .Select(d => new BaoCaoDiemResponse
            {
                SinhVienId = d.MaSinhVien,
                MonHocId = d.MaMonHoc,
                DiemTongKet = d.DiemTongKet
            })
            .ToListAsync();

        return diems;
    }

    public async Task<IEnumerable<SinhVienThanhTichResponse>> BaoCaoThanhTichAsync(BaoCaoThanhTichRequest request)
    {
        // Thiết lập logic phức tạp để lọc, tổng hợp và đánh giá thành tích của sinh viên
        // Code dưới đây chỉ là pseudo-code và cần được thiết lập dựa trên cơ sở dữ liệu và yêu cầu cụ thể của ứng dụng bạn
        List<SinhVienThanhTichResponse> sinhVienThanhTichResponses = new List<SinhVienThanhTichResponse>();

        // Mô phỏng quy trình thu thập dữ liệu
        // Đây chỉ là ví dụ và cần được điều chỉnh tùy theo cơ sở dữ liệu và nghiệp vụ cụ thể

        return sinhVienThanhTichResponses;
    }
}
