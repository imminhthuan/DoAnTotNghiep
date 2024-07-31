using asd123.Model;
using Microsoft.EntityFrameworkCore;

namespace asd123.Services
{
    public interface IKhoaService 
    {
        Task<IEnumerable<Khoa>> GetAllKhoaAsync();
        Task<Khoa> GetKhoaByIdAsync(Guid id);
        Task<Khoa> CreateKhoaAsync(Khoa khoa);
        Task UpdateKhoaAsync(Khoa khoa);
        Task DeleteKhoaAsync(Guid id);
        Task<IEnumerable<Khoa>> SearchKhoaByNameAsync(string name);
    }

    public class KhoaService : IKhoaService
    {
        private readonly ApplicationDbContext _context;

        public KhoaService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Khoa> CreateKhoaAsync(Khoa khoa)
        {
            _context.Khoas.Add(khoa);
            await _context.SaveChangesAsync();
            return khoa;
        }

        public async Task DeleteKhoaAsync(Guid id)
        {
            var khoa = await _context.Khoas.FindAsync(id);
            if (khoa != null)
            {
                _context.Khoas.Remove(khoa);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<Khoa>> GetAllKhoaAsync()
        {
            return await _context.Khoas.ToListAsync();
        }

        public async Task<Khoa> GetKhoaByIdAsync(Guid id)
        {
            return await _context.Khoas.FindAsync(id);
        }

        public async Task UpdateKhoaAsync(Khoa khoa)
        {
            _context.Entry(khoa).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }
        public async Task<IEnumerable<Khoa>> SearchKhoaByNameAsync(string name)
        {
            return await _context.Khoas.Where(k => k.TenKhoa.Contains(name)).ToListAsync();
        }
    }
}
