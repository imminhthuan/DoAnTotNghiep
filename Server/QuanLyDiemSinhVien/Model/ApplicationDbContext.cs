
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace asd123.Model
{
    public class ApplicationDbContext : IdentityDbContext<SinhVien, IdentityRole<Guid>, Guid>
    {
        public ApplicationDbContext()
        {
        }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }
        public  DbSet<Lop> Lops { get; set; }
        public  DbSet<Khoa> Khoas { get; set; }
        public  DbSet<ChuyenNganh> ChuyenNganhs { get; set; }
        public  DbSet<Diem> Diems { get; set; }
        public  DbSet<SinhVien> SinhViens { get; set; }
        public DbSet<MonHoc> MonHocs { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // modelBuilder.Entity<IdentityUserToken<Guid>>()
            //     .HasOne(t => t.UserId)
            //     .WithMany()
            //     .HasForeignKey(t => t.UserId)
            //     .IsRequired()
            //     .OnDelete(DeleteBehavior.Cascade); // Hoặc thay đổi DeleteBehavior tùy vào yêu cầu
            //
            // // Các cấu hình khác nếu cần

            // Hoặc nếu sử dụng GUID, bạn có thể sử dụng:
            modelBuilder.Entity<IdentityUserToken<Guid>>()
                .Property(t => t.UserId)
                .HasColumnType("char(36)")
                .IsRequired();
        }
    }
}
