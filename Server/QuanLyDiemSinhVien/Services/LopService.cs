using asd123.Model;
using Microsoft.EntityFrameworkCore;

namespace asd123.Services
{
    public interface ILop 
    {
        Task<IEnumerable<Lop>> GetAllLopAsync();
        Task<Lop> GetLopByIdAsync(Guid id);
        Task<Lop> CreateLopAsync(Lop lop);
        Task UpdateLopAsync(Lop lop);
        Task DeleteLopAsync(Guid id);
        Task<IEnumerable<Lop>> GetLopByChuyenNganhIdAsync(Guid chuyenNganhId);
        Task<IEnumerable<Lop>> SearchLopByNameOrCodeAsync(string searchText);
    }
    public class LopService : ILop
    {
        private readonly ApplicationDbContext _context;

        public LopService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Lop>> GetAllLopAsync()
        {
            return await _context.Lops.Include(l => l.ChuyenNganh).ToListAsync();
        }

        public async Task<Lop> GetLopByIdAsync(Guid id)
        {
            return await _context.Lops.Include(l => l.ChuyenNganh)
                .SingleOrDefaultAsync(l => l.Id == id);
        }

        public async Task<Lop> CreateLopAsync(Lop lop)
        {
            if (lop == null) throw new ArgumentNullException(nameof(lop));

            await _context.Lops.AddAsync(lop);
            await _context.SaveChangesAsync();
            return lop; // Trả về đối tượng Lop vừa được thêm vào cơ sở dữ liệu.
        }

        public async Task UpdateLopAsync(Lop lop)
        {
            if (lop == null) throw new ArgumentNullException(nameof(lop));

            _context.Lops.Update(lop);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteLopAsync(Guid id)
        {
            var lop = await _context.Lops.FindAsync(id);
            if (lop != null)
            {
                _context.Lops.Remove(lop);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<Lop>> GetLopByChuyenNganhIdAsync(Guid chuyenNganhId)
        {
            return await _context.Lops.Where(l => l.MaChuyenNganh == chuyenNganhId)
                .Include(l => l.ChuyenNganh)
                .ToListAsync();
        }

        public async Task<IEnumerable<Lop>> SearchLopByNameOrCodeAsync(string searchText)
        {
            return await _context.Lops.Where(l => l.TenLop.Contains(searchText))
                .Include(l => l.ChuyenNganh)
                .ToListAsync();
        }
    }

}
