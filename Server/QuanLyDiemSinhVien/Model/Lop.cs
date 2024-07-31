using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace asd123.Model
{
    public class Lop : BaseSchema
    {
        [Required] [StringLength(255)] public string TenLop { get; set; }
        public string MaLop { get; set; }

        public Guid MaChuyenNganh { get; set; }

        [ForeignKey("MaChuyenNganh")] public ChuyenNganh ChuyenNganh { get; set; }

        public ICollection<SinhVien> SinhViens { get; set; }

    }
}