using asd123.Model;
using Microsoft.EntityFrameworkCore;

namespace asd123.Services
{
    public interface IChuyenNganh 
    {
        Task<IEnumerable<ChuyenNganh>> GetAllChuyenNganhAsync();
        Task<ChuyenNganh> GetChuyenNganhByIdAsync(Guid id);
        Task<ChuyenNganh> CreateChuyenNganhAsync(ChuyenNganh chuyenNganh);
        Task UpdateChuyenNganhAsync(ChuyenNganh chuyenNganh);
        Task DeleteChuyenNganhAsync(Guid id);
        Task<IEnumerable<ChuyenNganh>> GetChuyenNganhByKhoaIdAsync(Guid khoaId);
        Task<IEnumerable<ChuyenNganh>> SearchChuyenNganhByNameAsync(string name);
    }
    public class ChuyenNganhService : IChuyenNganh
    {
        private readonly ApplicationDbContext _context;

        public ChuyenNganhService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ChuyenNganh> CreateChuyenNganhAsync(ChuyenNganh chuyenNganh)
        {
            _context.ChuyenNganhs.Add(chuyenNganh);
            await _context.SaveChangesAsync();
            return chuyenNganh;
        }

        public async Task DeleteChuyenNganhAsync(Guid id)
        {
            var chuyenNganh = await _context.ChuyenNganhs.FindAsync(id);
            if (chuyenNganh != null)
            {
                _context.ChuyenNganhs.Remove(chuyenNganh);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<ChuyenNganh>> GetAllChuyenNganhAsync()
        {
            return await _context.ChuyenNganhs.ToListAsync();
        }

        public async Task<ChuyenNganh> GetChuyenNganhByIdAsync(Guid id)
        {
            return await _context.ChuyenNganhs.FindAsync(id);
        }

        public async Task<IEnumerable<ChuyenNganh>> GetChuyenNganhByKhoaIdAsync(Guid khoaId)
        {
            return await _context.ChuyenNganhs
                .Where(cn => cn.MaKhoa == khoaId)
                .ToListAsync();
        }
        public async Task UpdateChuyenNganhAsync(ChuyenNganh chuyenNganh)
        {
            _context.Entry(chuyenNganh).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<ChuyenNganh>> SearchChuyenNganhByNameAsync(string name)
        {
            return await _context.ChuyenNganhs
                .Where(cn => cn.TenChuyenNganh.Contains(name))
                .ToListAsync();
        }

    }
}
