using asd123.DTO;
using asd123.Model;
using asd123.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using asd123.Biz.Roles;
using Microsoft.AspNetCore.Authorization;

namespace asd123.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MonHocController : ControllerBase
    {
        private readonly IMonHoc _monHocService;
        private readonly ILogger<MonHocController> _logger;

        public MonHocController(IMonHoc monHocService, ILogger<MonHocController> logger)
        {
            _monHocService = monHocService;
            _logger = logger;
        }

        // API lấy tất cả môn học
        [HttpGet]
        [Authorize(Roles = UserRoles.Root + "," + UserRoles.Admin)]
        public async Task<IActionResult> GetAllMonHoc()
        {
            try
            {
                var monHocs = await _monHocService.GetAllMonHocAsync();
                var monHocDTOs = monHocs.Select(monHoc => new MonHocDTO
                {
                    Id = monHoc.Id,
                    TenMonHoc = monHoc.TenMonHoc,
                    SoTinChi = monHoc.SoTinChi,
                    MaChuyenNganh = monHoc.MaChuyenNganh
                });

                return Ok(monHocDTOs);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Something went wrong inside GetAllMonHocs action: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        // API lấy một môn học theo ID
        [HttpGet("{id}", Name = "MonHocById")]
        [Authorize(Roles = UserRoles.Root + "," + UserRoles.Admin)]
        public async Task<IActionResult> GetMonHocById(Guid id)
        {
            try
            {
                var monHoc = await _monHocService.GetMonHocByIdAsync(id);
                if (monHoc == null)
                {
                    _logger.LogError($"MonHoc with id: {id}, hasn't been found in db.");
                    return NotFound();
                }

                var monHocDTO = new MonHocDTO
                {
                    Id = monHoc.Id,
                    TenMonHoc = monHoc.TenMonHoc,
                    SoTinChi = monHoc.SoTinChi,
                    MaChuyenNganh = monHoc.MaChuyenNganh
                };

                return Ok(monHocDTO);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Something went wrong inside GetMonHocById action: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        // API tạo mới một môn học
        [HttpPost]
        [Authorize(Roles = UserRoles.Root + "," + UserRoles.Admin)]
        public async Task<IActionResult> CreateMonHoc([FromBody] CreateMonHocDTO createMonHocDTO)
        {
            try
            {
                if (createMonHocDTO == null)
                {
                    _logger.LogError("MonHoc object sent from client is null.");
                    return BadRequest("MonHoc object is null");
                }

                var monHoc = new MonHoc
                {
                    Id = Guid.NewGuid(),
                    TenMonHoc = createMonHocDTO.TenMonHoc,
                    SoTinChi = createMonHocDTO.SoTinChi,
                    MaChuyenNganh = createMonHocDTO.MaChuyenNganh,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                await _monHocService.CreateMonHocAsync(monHoc);

                var monHocDTO = new MonHocDTO
                {
                    Id = monHoc.Id,
                    TenMonHoc = monHoc.TenMonHoc,
                    SoTinChi = monHoc.SoTinChi,
                    MaChuyenNganh = monHoc.MaChuyenNganh
                };

                return CreatedAtRoute("MonHocById", new { id = monHoc.Id }, monHocDTO);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Something went wrong inside CreateMonHoc action: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        // API cập nhật môn học
        [HttpPut("{id}")]
        [Authorize(Roles = UserRoles.Root + "," + UserRoles.Admin)]
        public async Task<IActionResult> UpdateMonHoc(Guid id, [FromBody] UpdateMonHocDTO updateMonHocDTO)
        {
            try
            {
                if (updateMonHocDTO == null)
                {
                    _logger.LogError("MonHoc object sent from client is null.");
                    return BadRequest("MonHoc object is null");
                }

                var dbMonHoc = await _monHocService.GetMonHocByIdAsync(id);
                if (dbMonHoc == null)
                {
                    _logger.LogError($"MonHoc with id: {id}, hasn't been found in db.");
                    return NotFound();
                }

                dbMonHoc.TenMonHoc = updateMonHocDTO.TenMonHoc;
                dbMonHoc.SoTinChi = updateMonHocDTO.SoTinChi;
                dbMonHoc.MaChuyenNganh = updateMonHocDTO.MaChuyenNganh;
                dbMonHoc.UpdatedAt = DateTime.UtcNow;

                await _monHocService.UpdateMonHocAsync(dbMonHoc);

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Something went wrong inside UpdateMonHoc action: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        // API xóa môn học
        [HttpDelete("{id}")]
        [Authorize(Roles = UserRoles.Root + "," + UserRoles.Admin)]
        public async Task<IActionResult> DeleteMonHoc(Guid id)
        {
            try
            {
                var monHoc = await _monHocService.GetMonHocByIdAsync(id);
                if (monHoc == null)
                {
                    _logger.LogError($"MonHoc with id: {id}, hasn't been found in db.");
                    return NotFound();
                }

                await _monHocService.DeleteMonHocAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Something went wrong inside DeleteMonHoc action: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/MonHoc/GetMonHocByChuyenNganhId/{chuyenNganhId}
        [HttpGet("GetMonHocByChuyenNganhId/{chuyenNganhId}")]
        [Authorize(Roles = UserRoles.Root + "," + UserRoles.Admin)]
        public async Task<ActionResult<IEnumerable<MonHocDTO>>> GetMonHocByChuyenNganhId(Guid chuyenNganhId)
        {
            try
            {
                var monHocs = await _monHocService.GetMonHocByChuyenNganhIdAsync(chuyenNganhId);
                var monHocDTOs = monHocs.Select(monHoc => new MonHocDTO
                {
                    Id = monHoc.Id,
                    TenMonHoc = monHoc.TenMonHoc,
                    SoTinChi = monHoc.SoTinChi,
                    MaChuyenNganh = monHoc.MaChuyenNganh
                });

                return Ok(monHocDTOs);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Something went wrong inside GetMonHocByChuyenNganhId action: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/MonHoc/SearchMonHocByName/{name}
        [HttpGet("SearchMonHocByName/{name}")]
        public async Task<ActionResult<IEnumerable<MonHocDTO>>> SearchMonHocByName(string name)
        {
            try
            {
                if (string.IsNullOrEmpty(name))
                {
                    _logger.LogWarning("SearchMonHocByName called with null or empty search text.");
                    return BadRequest("Search text is null or empty.");
                }

                var monHocs = await _monHocService.SearchMonHocByNameAsync(name);
                var monHocDTOs = monHocs.Select(monHoc => new MonHocDTO
                {
                    Id = monHoc.Id,
                    TenMonHoc = monHoc.TenMonHoc,
                    SoTinChi = monHoc.SoTinChi,
                    MaChuyenNganh = monHoc.MaChuyenNganh
                });

                return Ok(monHocDTOs);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Something went wrong inside SearchMonHocByName action: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}