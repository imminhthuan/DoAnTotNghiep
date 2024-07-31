using asd123.Biz.Roles;
using asd123.DTO;
using asd123.Model;
using asd123.Services;
using Microsoft.AspNetCore.Authorization;

namespace asd123.Controllers;

using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
public class LopController : ControllerBase
{
    private readonly ILop _lopService;
    private readonly ILogger<LopController> _logger;

    public LopController(ILop lopService, ILogger<LopController> logger)
    {
        _lopService = lopService;
        _logger = logger;
    }

    [HttpGet]
    [Authorize(Roles = UserRoles.Root + "," + UserRoles.Admin)]
    public async Task<ActionResult<IEnumerable<LopDTO>>> GetAllLop()
    {
        _logger.LogInformation("Getting all Lops");
        var lops = (await _lopService.GetAllLopAsync())
            .Select(l => new LopDTO
            {
                Id = l.Id,
                TenLop = l.TenLop,
                MaLop = l.MaLop,
                MaChuyenNganh = l.MaChuyenNganh,
                TenChuyenNganh = l.ChuyenNganh?.TenChuyenNganh
            }).ToList();

        return Ok(lops);
    }


    [HttpGet("{id}")]
    [Authorize(Roles = UserRoles.Root + "," + UserRoles.Admin)]
    public async Task<ActionResult<LopDTO>> GetLopById(Guid id)
    {
        _logger.LogInformation($"Getting Lop by id: {id}");
        var lop = await _lopService.GetLopByIdAsync(id);
        if (lop == null)
        {
            _logger.LogWarning($"Lop with id {id} not found");
            return NotFound();
        }

        var lopDto = new LopDTO
        {
            Id = lop.Id,
            TenLop = lop.TenLop,
            MaLop = lop.MaLop,
            MaChuyenNganh = lop.MaChuyenNganh,
            TenChuyenNganh = lop.ChuyenNganh?.TenChuyenNganh
        };
        return Ok(lopDto);
    }


    [HttpPost]
    [Authorize(Roles = UserRoles.Root + "," + UserRoles.Admin)]
    public async Task<ActionResult<LopDTO>> CreateLop([FromBody] CreateLopDTO createLopDTO)
    {
        if (createLopDTO == null)
        {
            _logger.LogWarning("CreateLop request with null data");
            return BadRequest("Lop data is null");
        }

        Lop newLop = new Lop
        {
            TenLop = createLopDTO.TenLop,
            MaLop = createLopDTO.MaLop,
            MaChuyenNganh = createLopDTO.MaChuyenNganh
        };

        var createdLop = await _lopService.CreateLopAsync(newLop);
        _logger.LogInformation($"Created Lop with ID: {createdLop.Id}");

        var lopDto = new LopDTO
        {
            Id = createdLop.Id,
            TenLop = createdLop.TenLop,
            MaLop = createLopDTO.MaLop,
            MaChuyenNganh = createdLop.MaChuyenNganh,
            TenChuyenNganh = createdLop.ChuyenNganh?.TenChuyenNganh
        };

        return CreatedAtAction(nameof(GetLopById), new { id = lopDto.Id }, lopDto);
    }


    [HttpPut("{id}")]
    [Authorize(Roles = UserRoles.Root + "," + UserRoles.Admin)]
    public async Task<IActionResult> UpdateLop(Guid id, [FromBody] UpdateLopDTO updateLopDTO)
    {
        _logger.LogInformation($"Attempting to update Lop with ID: {id}");

        if (id == Guid.Empty || updateLopDTO == null)
        {
            _logger.LogWarning("UpdateLop request is invalid.");
            return BadRequest("Invalid request.");
        }

        var lopToUpdate = await _lopService.GetLopByIdAsync(id);
        if (lopToUpdate == null)
        {
            _logger.LogWarning($"Lop with ID: {id} not found.");
            return NotFound("The Lop record couldn't be found.");
        }

        lopToUpdate.TenLop = updateLopDTO.TenLop;
        lopToUpdate.MaLop = updateLopDTO.MaLop;
        lopToUpdate.MaChuyenNganh = updateLopDTO.MaChuyenNganh;

        await _lopService.UpdateLopAsync(lopToUpdate);
        _logger.LogInformation($"Lop with ID: {id} updated successfully.");

        return NoContent();
    }


    [HttpDelete("{id}")]
    [Authorize(Roles = UserRoles.Root + "," + UserRoles.Admin)]
    public async Task<IActionResult> DeleteLop(Guid id)
    {
        _logger.LogInformation($"Attempting to delete Lop with ID: {id}");

        var lopToDelete = await _lopService.GetLopByIdAsync(id);
        if (lopToDelete == null)
        {
            _logger.LogWarning($"Lop with ID: {id} not found.");
            return NotFound("The Lop record couldn't be found.");
        }

        await _lopService.DeleteLopAsync(id);

        _logger.LogInformation($"Deleted Lop with ID: {id} successfully.");

        return NoContent();
    }


    [HttpGet("GetLopByChuyenNganhId/{chuyenNganhId}")]
    [Authorize(Roles = UserRoles.Root + "," + UserRoles.Admin)]
    public async Task<ActionResult<IEnumerable<LopDTO>>> GetLopByChuyenNganhId(Guid chuyenNganhId)
    {
        _logger.LogInformation($"Fetching Lops by ChuyenNganh ID: {chuyenNganhId}");

        var lops = (await _lopService.GetLopByChuyenNganhIdAsync(chuyenNganhId))
            .Select(l => new LopDTO
            {
                Id = l.Id,
                TenLop = l.TenLop,
                MaLop = l.MaLop,
                MaChuyenNganh = l.MaChuyenNganh,
                TenChuyenNganh = l.ChuyenNganh?.TenChuyenNganh // Assuming you have navigation property
            });

        return Ok(lops);
    }


    [HttpGet("SearchByNameOrCode/{searchText}")]
    public async Task<ActionResult<IEnumerable<LopDTO>>> SearchLopByNameOrCode(string searchText)
    {
        _logger.LogInformation($"Searching Lops by name or code: {searchText}");

        var lops = (await _lopService.SearchLopByNameOrCodeAsync(searchText))
            .Select(l => new LopDTO
            {
                Id = l.Id,
                TenLop = l.TenLop,
                MaLop = l.MaLop,
                MaChuyenNganh = l.MaChuyenNganh,
                TenChuyenNganh = l.ChuyenNganh?.TenChuyenNganh // Assuming you have navigation property
            });

        return Ok(lops);
    }
}