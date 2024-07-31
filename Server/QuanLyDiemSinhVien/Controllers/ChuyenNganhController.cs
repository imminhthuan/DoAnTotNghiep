using asd123.Biz.Roles;
using asd123.DTO;
using asd123.Model;
using asd123.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace asd123.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ChuyenNganhController : ControllerBase
{
    private readonly IChuyenNganh _chuyenNganhService;
    private readonly ILogger<ChuyenNganhController> _logger;

    public ChuyenNganhController(IChuyenNganh chuyenNganhService, ILogger<ChuyenNganhController> logger)
    {
        _chuyenNganhService = chuyenNganhService;
        _logger = logger;
    }

    // GET: api/ChuyenNganh
    [HttpGet]
    [Authorize(Roles = UserRoles.Root + "," + UserRoles.Admin)]
    public async Task<ActionResult<IEnumerable<ChuyenNganh>>> GetAllChuyenNganh()
    {
        try
        {
            var chuyenNganhs = await _chuyenNganhService.GetAllChuyenNganhAsync();
            return Ok(chuyenNganhs);
        }
        catch (Exception ex)
        {
            _logger.LogError($"An error occurred while getting all ChuyenNganh: {ex.Message}");
            return StatusCode(500, "Internal Server Error");
        }
    }

    // GET: api/ChuyenNganh/{id}
    [HttpGet("{id}")]
    [Authorize(Roles = UserRoles.Root + "," + UserRoles.Admin)]
    public async Task<ActionResult<ChuyenNganh>> GetChuyenNganhById(Guid id)
    {
        try
        {
            var chuyenNganh = await _chuyenNganhService.GetChuyenNganhByIdAsync(id);

            if (chuyenNganh == null)
            {
                _logger.LogWarning($"ChuyenNganh with ID {id} not found.");
                return NotFound();
            }

            return Ok(chuyenNganh);
        }
        catch (Exception ex)
        {
            _logger.LogError($"An error occurred while getting ChuyenNganh by ID {id}: {ex.Message}");
            return StatusCode(500, "Internal Server Error");
        }
    }

    [HttpPost]
    [Authorize(Roles = UserRoles.Root + "," + UserRoles.Admin)]
    public async Task<ActionResult<ChuyenNganh>> CreateChuyenNganh(CreateChuyenNganhDto chuyenNganhDto)
    {
        if (chuyenNganhDto == null)
        {
            return BadRequest();
        }

        try
        {
            // Map từ DTO sang model
            var chuyenNganhModel = new ChuyenNganh
            {
                TenChuyenNganh = chuyenNganhDto.TenChuyenNganh,
                MaKhoa = chuyenNganhDto.MaKhoa
            };

            var createdChuyenNganh = await _chuyenNganhService.CreateChuyenNganhAsync(chuyenNganhModel);
            _logger.LogInformation($"ChuyenNganh with ID {createdChuyenNganh.Id} created successfully.");
            return CreatedAtAction(nameof(GetChuyenNganhById), new { id = createdChuyenNganh.Id }, createdChuyenNganh);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error when creating ChuyenNganh: {ex.Message}");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPut("{id}")]
    [Authorize(Roles = UserRoles.Root + "," + UserRoles.Admin)]
    public async Task<IActionResult> UpdateChuyenNganh(Guid id, UpdateChuyenNganhDto chuyenNganhDto)
    {
        if (chuyenNganhDto == null || id == Guid.Empty)
        {
            return BadRequest();
        }

        try
        {
            var chuyenNganhFromDb = await _chuyenNganhService.GetChuyenNganhByIdAsync(id);

            if (chuyenNganhFromDb == null)
            {
                _logger.LogWarning($"ChuyenNganh with ID {id} not found.");
                return NotFound();
            }

            // Map từ DTO sang model, cập nhật dữ liệu
            chuyenNganhFromDb.TenChuyenNganh = chuyenNganhDto.TenChuyenNganh;
            chuyenNganhFromDb.MaKhoa = chuyenNganhDto.MaKhoa;
            // ... update other fields

            await _chuyenNganhService.UpdateChuyenNganhAsync(chuyenNganhFromDb);
            _logger.LogInformation($"ChuyenNganh with ID {id} updated successfully.");

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error when updating ChuyenNganh with ID {id}: {ex.Message}");
            return StatusCode(500, "Internal server error");
        }
    }


    // DELETE: api/ChuyenNganh/{id}
    [HttpDelete("{id}")]
    [Authorize(Roles = UserRoles.Root + "," + UserRoles.Admin)]
    public async Task<IActionResult> DeleteChuyenNganh(Guid id)
    {
        try
        {
            var chuyenNganh = await _chuyenNganhService.GetChuyenNganhByIdAsync(id);
            if (chuyenNganh == null)
            {
                _logger.LogWarning($"DeleteChuyenNganh: ChuyenNganh with ID {id} not found.");
                return NotFound();
            }

            await _chuyenNganhService.DeleteChuyenNganhAsync(id);
            _logger.LogInformation($"ChuyenNganh with ID {id} has been deleted.");
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(
                $"DeleteChuyenNganh: An error occurred when trying to delete ChuyenNganh with ID {id}. Exception: {ex.Message}");
            return StatusCode(500, "Internal Server Error");
        }
    }

// GET: api/ChuyenNganh/GetChuyenNganhByKhoaId/{khoaId}
    [HttpGet("GetChuyenNganhByKhoaId/{khoaId}")]
    [Authorize(Roles = UserRoles.Root + "," + UserRoles.Admin)]
    public async Task<ActionResult<IEnumerable<ChuyenNganh>>> GetChuyenNganhByKhoaId(Guid khoaId)
    {
        try
        {
            var chuyenNganhs = await _chuyenNganhService.GetChuyenNganhByKhoaIdAsync(khoaId);
            if (chuyenNganhs == null || !chuyenNganhs.Any())
            {
                _logger.LogWarning($"GetChuyenNganhByKhoaId: No ChuyenNganh found for KhoaId {khoaId}.");
                return NotFound();
            }

            return Ok(chuyenNganhs);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex,
                $"GetChuyenNganhByKhoaId: An error occurred while getting ChuyenNganhs by KhoaId {khoaId}.");
            return StatusCode(500, "Internal Server Error");
        }
    }

// GET: api/ChuyenNganh/SearchByName/{name}
    [HttpGet("SearchByName/{name}")]
    public async Task<ActionResult<IEnumerable<ChuyenNganh>>> SearchChuyenNganhByName(string name)
    {
        try
        {
            var chuyenNganhs = await _chuyenNganhService.SearchChuyenNganhByNameAsync(name);
            if (chuyenNganhs == null || !chuyenNganhs.Any())
            {
                _logger.LogWarning($"SearchChuyenNganhByName: No ChuyenNganh found with name {name}.");
                return NotFound();
            }

            return Ok(chuyenNganhs);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex,
                $"SearchChuyenNganhByName: An error occurred while searching ChuyenNganh by name {name}.");
            return StatusCode(500, "Internal Server Error");
        }
    }
}