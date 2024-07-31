using asd123.Biz.Roles;
using asd123.DTO;
using asd123.Model;
using asd123.Presenters.Department;
using asd123.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace asd123.Controllers;

[Route("api/[controller]")]
[ApiController]
public class KhoaController : ControllerBase
{
    private readonly IKhoaService _khoaService;
    private readonly ILogger<KhoaController> _logger; // Giả định bạn đã inject logger

    public KhoaController(IKhoaService khoaService, ILogger<KhoaController> logger)
    {
        _khoaService = khoaService;
        _logger = logger;
    }

    [HttpGet]
    [Authorize(Roles = UserRoles.Root + "," + UserRoles.Admin)]
    public async Task<ActionResult<IEnumerable<KhoaDto>>> GetAllKhoa()
    {
        var khoas = await _khoaService.GetAllKhoaAsync();
        return Ok(khoas.Select(k => new KhoaDto { Id = k.Id, TenKhoa = k.TenKhoa })); // Chuyển đổi sang DTO
    }

    [HttpGet("{id}")]
    [Authorize(Roles = UserRoles.Root + "," + UserRoles.Admin)]
    public async Task<ActionResult<KhoaDto>> GetKhoaById(Guid id)
    {
        var khoa = await _khoaService.GetKhoaByIdAsync(id);

        if (khoa == null)
        {
            _logger.LogInformation($"Không tìm thấy khoa với ID: {id}.");
            return NotFound($"Không tìm thấy khoa với ID: {id}.");
        }

        return Ok(new KhoaDto { Id = khoa.Id, TenKhoa = khoa.TenKhoa }); // Chuyển đổi sang DTO
    }

    [HttpPost]
    [Authorize(Roles = UserRoles.Root + "," + UserRoles.Admin)]
    public async Task<IActionResult> CreateKhoa([FromBody] KhoaPresenter khoaPresenter)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var khoa = new Khoa
        {
            TenKhoa = khoaPresenter.TenKhoa,
        };

        try
        {
            await _khoaService.CreateKhoaAsync(khoa);
            var dto = new KhoaDto { Id = khoa.Id, TenKhoa = khoa.TenKhoa };
            return CreatedAtAction(nameof(GetKhoaById), new { id = khoa.Id },
                dto); // Trả về 201 và URI tới resource mới
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi tạo khoa mới.");
            return StatusCode(500, "Có lỗi xảy ra khi tạo khoa mới.");
        }
    }

    [HttpPut("{id}")]
    [Authorize(Roles = UserRoles.Root + "," + UserRoles.Admin)]
    public async Task<IActionResult> UpdateKhoa(Guid id, [FromBody] KhoaPresenter khoaPresenter)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var khoaToUpdate = await _khoaService.GetKhoaByIdAsync(id);
        if (khoaToUpdate == null)
        {
            _logger.LogInformation($"Không tìm thấy khoa với ID: {id} để cập nhật.");
            return NotFound($"Không tìm thấy khoa với ID: {id} để cập nhật.");
        }

        khoaToUpdate.TenKhoa = khoaPresenter.TenKhoa;

        try
        {
            await _khoaService.UpdateKhoaAsync(khoaToUpdate);
            return NoContent(); // Trả về 204 No Content khi cập nhật thành công
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Lỗi khi cập nhật khoa với ID: {id}.");
            return StatusCode(500, "Có lỗi xảy ra khi cập nhật khoa.");
        }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = UserRoles.Root + "," + UserRoles.Admin)]
    public async Task<IActionResult> DeleteKhoa(Guid id)
    {
        var khoa = await _khoaService.GetKhoaByIdAsync(id);
        if (khoa == null)
        {
            _logger.LogInformation($"Không tìm thấy khoa với ID: {id} để xóa.");
            return NotFound();
        }

        try
        {
            await _khoaService.DeleteKhoaAsync(id);
            return NoContent(); // Trả về 204 No Content khi xóa thành công
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Lỗi khi xóa khoa với ID: {id}.");
            return StatusCode(500, "Có lỗi xảy ra khi xóa khoa.");
        }
    }

    [HttpGet("SearchByName/{name}")]
    public async Task<ActionResult<IEnumerable<KhoaDto>>> SearchKhoaByName(string name)
    {
        var khoas = await _khoaService.SearchKhoaByNameAsync(name);
        return Ok(khoas.Select(k => new KhoaDto { Id = k.Id, TenKhoa = k.TenKhoa })); // Chuyển đổi sang DTO và trả về
    }
}