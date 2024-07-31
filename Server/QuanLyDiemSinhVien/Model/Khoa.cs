using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace asd123.Model
{
    public class Khoa : BaseSchema
    {
        [Required]
        [StringLength(255)]
        public string TenKhoa { get; set; }

        public ICollection<ChuyenNganh> ChuyenNganhs { get; set; }
    }
}
