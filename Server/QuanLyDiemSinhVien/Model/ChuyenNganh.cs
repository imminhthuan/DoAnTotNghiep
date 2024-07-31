using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace asd123.Model
{
    public class ChuyenNganh : BaseSchema
    {
        [Required]
        [StringLength(255)]
        public string TenChuyenNganh { get; set; }

        public Guid MaKhoa { get; set; }

        [ForeignKey("MaKhoa")]
        public Khoa Khoa { get; set; }

        public ICollection<Lop> Lops { get; set; }
    }
}
