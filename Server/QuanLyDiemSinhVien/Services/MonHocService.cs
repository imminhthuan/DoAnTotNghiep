using asd123.DTO;
using asd123.Model;
using Microsoft.EntityFrameworkCore;

namespace asd123.Services
{
    public interface IMonHoc 
    {
        Task<IEnumerable<MonHoc>> GetAllMonHocAsync();
        Task<MonHoc> GetMonHocByIdAsync(Guid id);
        Task<MonHoc> CreateMonHocAsync(MonHoc monHoc);
        Task UpdateMonHocAsync(MonHoc monHoc);
        Task DeleteMonHocAsync(Guid id);
        Task<IEnumerable<MonHoc>> GetMonHocByChuyenNganhIdAsync(Guid chuyenNganhId);
        Task<IEnumerable<MonHoc>> SearchMonHocByNameAsync(string name);
    }
    public class MonHocService : IMonHoc
    {
        private readonly ApplicationDbContext _context;

        public MonHocService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<MonHoc>> GetAllMonHocAsync()
        {
            return await _context.MonHocs.Include(m => m.ChuyenNganh).ToListAsync();
        }

        public async Task<MonHoc> GetMonHocByIdAsync(Guid id)
        {
            return await _context.MonHocs.Include(m => m.ChuyenNganh)
                .SingleOrDefaultAsync(m => m.Id == id);
        }

        public async Task<MonHoc> CreateMonHocAsync(MonHoc monHoc)
        {
            if (monHoc == null) throw new ArgumentNullException(nameof(monHoc));

            await _context.MonHocs.AddAsync(monHoc);
            await _context.SaveChangesAsync();
            return monHoc; // Trả về đối tượng MonHoc vừa được thêm vào cơ sở dữ liệu.
        }

        public async Task UpdateMonHocAsync(MonHoc monHoc)
        {
            if (monHoc == null) throw new ArgumentNullException(nameof(monHoc));

            _context.MonHocs.Update(monHoc);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteMonHocAsync(Guid id)
        {
            var monHoc = await _context.MonHocs.FindAsync(id);
            if (monHoc != null)
            {
                _context.MonHocs.Remove(monHoc);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<MonHoc>> GetMonHocByChuyenNganhIdAsync(Guid chuyenNganhId)
        {
            return await _context.MonHocs.Where(m => m.MaChuyenNganh == chuyenNganhId)
                .Include(m => m.ChuyenNganh)
                .ToListAsync();
        }

        public async Task<IEnumerable<MonHoc>> SearchMonHocByNameAsync(string name)
        {
            return await _context.MonHocs.Where(m => m.TenMonHoc.Contains(name))
                .Include(m => m.ChuyenNganh)
                .ToListAsync();
        }
    }

}
