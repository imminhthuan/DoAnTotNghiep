using asd123.Biz.Roles;
using Microsoft.AspNetCore.Mvc;
using asd123.DTO;
using asd123.Helpers;
using asd123.Model;
using asd123.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace asd123.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DiemController : ControllerBase
    {
        private readonly IDiem _diemService;
        private readonly UserManager<SinhVien> userManager;

        public DiemController(
            IDiem diemService,
            UserManager<SinhVien> userManager
        )
        {
            this.userManager = userManager;
            _diemService = diemService;
        }

        [HttpPost("NhapDiem")]
        [Authorize(Roles = UserRoles.Root + "," + UserRoles.Admin)]
        public async Task<ActionResult<NhapDiemResponse>> NhapDiem(Guid sinhVienId, Guid monHocId,
            [FromBody] DiemDTO diemDTO)
        {
            if (diemDTO == null)
            {
                return BadRequest("DiemDTO data is null");
            }

            try
            {
                var response = await _diemService.NhapDiemAsync(sinhVienId, monHocId, diemDTO);
                if (response == null)
                {
                    return NotFound("Khong the nhap diem.");
                }

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal Server Error");
            }
        }

        [HttpPost("NhapDiemForClass")]
        [Authorize(Roles = UserRoles.Root + "," + UserRoles.Admin)]
        public async Task<ActionResult> NhapDiemForClass([FromBody] NhapDiemForClassDTO nhapDiemForClassDTO)
        {
            if (nhapDiemForClassDTO == null || nhapDiemForClassDTO.StudentScores == null ||
                !nhapDiemForClassDTO.StudentScores.Any())
            {
                return BadRequest("NhapDiemForClassDTO data is null or empty");
            }

            try
            {
                var result = await _diemService.NhapDiemForClassAsync(nhapDiemForClassDTO.MonHocId,
                    nhapDiemForClassDTO.StudentScores);
                if (!result)
                {
                    return NotFound("Khong the nhap diem.");
                }

                return Ok(new
                    { Status = "Success", Message = "Diem entered successfully for all students in the class." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal Server Error");
            }
        }


        [HttpPut("UpdateDiem/{diemId}")]
        [Authorize(Roles = UserRoles.Root + "," + UserRoles.Admin)]
        public async Task<IActionResult> UpdateDiem(Guid diemId, [FromBody] DiemDTO diemDTO)
        {
            if (diemDTO == null)
            {
                return BadRequest("DiemDTO data is null");
            }

            try
            {
                await _diemService.UpdateDiemAsync(diemId, diemDTO);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal Server Error");
            }
        }

        [HttpDelete("DeleteDiem/{sinhVienId}/{monHocId}")]
        [Authorize(Roles = UserRoles.Root + "," + UserRoles.Admin)]
        public async Task<IActionResult> DeleteDiem(Guid sinhVienId, Guid monHocId)
        {
            try
            {
                await _diemService.DeleteDiemAsync(sinhVienId, monHocId);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal Server Error");
            }
        }

        [HttpGet("GetAllDiemBySinhVienLogin")]
        [Authorize(Roles = UserRoles.Student)]
        public async Task<ActionResult<IEnumerable<Diem>>> GetAllDiemBySinhVienLogin()
        {
            var user = await userManager.GetUserAsync(User);
            if (user == null)
                return NotFound(new Response { Status = "Error", Message = "User not found!" });

            var diems = await _diemService.GetAllDiemBySinhVienIdAsync(user.Id);
            if (diems == null || !diems.Any())
            {
                return NotFound();
            }

            return Ok(diems);
        }

        [HttpGet("GetAllDiemBySinhVienId/{sinhVienId}")]
        [Authorize(Roles = UserRoles.Root + "," + UserRoles.Admin)]
        public async Task<ActionResult<IEnumerable<Diem>>> GetAllDiemBySinhVienId(Guid sinhVienId)
        {
            var diems = await _diemService.GetAllDiemBySinhVienIdAsync(sinhVienId);
            if (diems == null || !diems.Any())
            {
                return NotFound();
            }

            return Ok(diems);
        }

        [HttpGet("GetAllDiemByMonHocId/{monHocId}")]
        [Authorize(Roles = UserRoles.Root + "," + UserRoles.Admin)]
        public async Task<ActionResult<IEnumerable<Diem>>> GetAllDiemByMonHocId(Guid monHocId)
        {
            var diems = await _diemService.GetAllDiemByMonHocIdAsync(monHocId);
            if (diems == null || !diems.Any())
            {
                return NotFound();
            }

            return Ok(diems);
        }

        [HttpGet("TinhDiemTB/{sinhVienId}")]
        [Authorize(Roles = UserRoles.Root + "," + UserRoles.Admin)]
        public async Task<ActionResult<TinhDiemTBResponse>> TinhDiemTB(Guid sinhVienId)
        {
            var response = await _diemService.TinhDiemTBAsync(sinhVienId);
            if (response == null)
            {
                return NotFound();
            }

            return Ok(response);
        }
    }
}