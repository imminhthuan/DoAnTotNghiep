using asd123.Biz.Roles;
using asd123.DTO;
using asd123.Helpers;
using asd123.Model;
using asd123.Services;
using asd123.Ultil;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace asd123.Controllers;

using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
public class SinhVienController : ControllerBase
{
    private readonly ISinhVien _sinhVienService;
    private readonly UserManager<SinhVien> userManager;
    private readonly RoleManager<IdentityRole<Guid>> roleManager;
    private readonly ILogger<SinhVienController> _logger;

    public SinhVienController(
        ISinhVien sinhVienService,
        ILogger<SinhVienController> logger,
        UserManager<SinhVien> userManager,
        RoleManager<IdentityRole<Guid>> roleManager)
    {
        this.userManager = userManager;
        this.roleManager = roleManager;
        _sinhVienService = sinhVienService;
        _logger = logger;
    }

    // Lấy tất cả sinh viên
    [HttpGet("GetAllStudents")]
    [Authorize(Roles = UserRoles.Root + "," + UserRoles.Admin)]
    public async Task<ActionResult<List<SinhVienDTO>>> GetAllStudents()
    {
        try
        {
            // Get all users with role "Student"
            var students = await userManager.GetUsersInRoleAsync(UserRoles.Student);

            // Mapping to DTOs, assuming you have MapToDTO method or using a library like AutoMapper
            var studentDTOs = students.Select(sv => MapToDTO(sv)).ToList();

            return Ok(studentDTOs);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Failed to get all students: {ex.Message}");
            return StatusCode(500, "Internal server error");
        }
    }


    [HttpPost]
    [Authorize(Roles = UserRoles.Root + "," + UserRoles.Admin)]
    public async Task<ActionResult<SinhVienDTO>> Create([FromBody] CreateSinhVienDTO model)
    {
        try
        {
            var userExists = await userManager.FindByNameAsync(model.Username);
            if (userExists != null)
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new Response { Status = "Error", Message = "Student already exists!" });
            var lopExist = await _sinhVienService.GetLopByIdAsync(model.MaLop);
            if (lopExist == null)
                return StatusCode(StatusCodes.Status400BadRequest,
                    new Response { Status = "Error", Message = "Lop is not exists!" });
            SinhVien user = new SinhVien()
            {
                Email = model.Email,
                SecurityStamp = Guid.NewGuid().ToString(),
                UserName = model.Username,
                DiaChi = model.DiaChi,
                GioiTinh = model.GioiTinh,
                HoTen = model.HoTen,
                NgaySinh = model.NgaySinh,
                NienKhoa = model.NienKhoa,
                SoDienThoai = model.SoDienThoai,
                TrinhDo = model.TrinhDo,
                MaLop = lopExist.Id
            };
            user.GenerateMaSinhVien();

            var result = await userManager.CreateAsync(user, base_pw.password_Default);
            if (!result.Succeeded)
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new Response
                    {
                        Status = "Error",
                        Message = "Student creation failed! Please check Student details and try again."
                    });

            if (!await roleManager.RoleExistsAsync(UserRoles.Student))
                await roleManager.CreateAsync(new IdentityRole<Guid>(UserRoles.Student));
            await userManager.AddToRoleAsync(user, UserRoles.Student);

            return Ok(new Response { Status = "Success", Message = "Student created successfully!" });
        }
        catch (Exception ex)
        {
            _logger.LogError($"Failed to create student: {ex.Message}");
            return StatusCode(500, ex.Message);
        }
    }

// POST: api/SinhVien/NhapNhieuSinhVien
    [HttpPost("NhapNhieuSinhVien")]
    [Authorize(Roles = UserRoles.Root + "," + UserRoles.Admin)]
    public async Task<ActionResult> NhapNhieuSinhVien([FromBody] SinhVienDTOs sinhVienDTOs)
    {
        _logger.LogInformation("Starting NhapNhieuSinhVien");

        if (sinhVienDTOs == null || sinhVienDTOs.SinhViens == null || !sinhVienDTOs.SinhViens.Any())
        {
            _logger.LogWarning("SinhVienDTOs data is null or empty");
            return BadRequest("SinhVienDTOs data is null or empty");
        }

        var createdSinhViens = new List<SinhVienDTO>();
        var errors = new List<string>();

        foreach (var createDto in sinhVienDTOs.SinhViens)
        {
            try
            {
                // Check if the user already exists
                var userExists = await userManager.FindByNameAsync(createDto.Username);
                if (userExists != null)
                {
                    errors.Add($"Student with username {createDto.Username} already exists!");
                    continue;
                }

                // Check if the Lop exists
                var lopExist = await _sinhVienService.GetLopByIdAsync(createDto.MaLop);
                if (lopExist == null)
                {
                    errors.Add($"Lop with ID {createDto.MaLop} does not exist!");
                    continue;
                }

                // Map from CreateSinhVienDTO to SinhVien entity
                var newSinhVien = new SinhVien
                {
                    Email = createDto.Email,
                    SecurityStamp = Guid.NewGuid().ToString(),
                    UserName = createDto.Username,
                    DiaChi = createDto.DiaChi,
                    GioiTinh = createDto.GioiTinh,
                    HoTen = createDto.HoTen,
                    NgaySinh = createDto.NgaySinh,
                    NienKhoa = createDto.NienKhoa,
                    SoDienThoai = createDto.SoDienThoai,
                    TrinhDo = createDto.TrinhDo,
                    MaLop = lopExist.Id
                };
                newSinhVien.GenerateMaSinhVien();

                // Create the user
                var result = await userManager.CreateAsync(newSinhVien, base_pw.password_Default);
                if (!result.Succeeded)
                {
                    errors.Add(
                        $"Failed to create student with username {createDto.Username}: {string.Join(", ", result.Errors.Select(e => e.Description))}");
                    continue;
                }

                // Ensure the Student role exists
                if (!await roleManager.RoleExistsAsync(UserRoles.Student))
                {
                    await roleManager.CreateAsync(new IdentityRole<Guid>(UserRoles.Student));
                }

                // Assign the Student role to the new user
                await userManager.AddToRoleAsync(newSinhVien, UserRoles.Student);

                // Map from SinhVien entity to SinhVienDTO
                var sinhVienDTO = new SinhVienDTO
                {
                    Id = newSinhVien.Id,
                    MaSinhVien = newSinhVien.MaSinhVien,
                    HoTen = newSinhVien.HoTen,
                    NgaySinh = newSinhVien.NgaySinh,
                    Email = newSinhVien.Email,
                    SoDienThoai = newSinhVien.SoDienThoai,
                    MaLop = newSinhVien.MaLop,
                    DiaChi = newSinhVien.DiaChi
                };

                createdSinhViens.Add(sinhVienDTO);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error occurred while importing student {createDto.Username}: {ex.Message}");
                errors.Add($"Error occurred while importing student {createDto.Username}: {ex.Message}");
            }
        }

        if (errors.Any())
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new { Status = "Error", Messages = errors });
        }

        _logger.LogInformation("NhapNhieuSinhVien successfully completed.");
        return Ok(new { Status = "Success", Students = createdSinhViens });
    }

    [HttpGet("GetProfileBySinhVienLogin")]
    [Authorize(Roles = UserRoles.Student)]
    public async Task<ActionResult<IEnumerable<SinhVien>>> GetProfileBySinhVienLogin()
    {
        var user = await userManager.GetUserAsync(User);
        if (user == null)
            return NotFound(new Response { Status = "Error", Message = "User not found!" });

        var stu = await _sinhVienService.GetSinhVienByIdAsync(user.Id);
        if (stu == null)
        {
            return NotFound();
        }

        return Ok(stu);
    }

    [HttpGet("{id}")]
    [Authorize(Roles = UserRoles.Root + "," + UserRoles.Admin)]
    public async Task<ActionResult<SinhVienDTO>> GetById(Guid id)
    {
        try
        {
            var students = await userManager.GetUsersInRoleAsync(UserRoles.Student);

            // Mapping to DTOs, assuming you have MapToDTO method or using a library like AutoMapper
            var studentDTOs = students.Where(sv => sv.Id == id).Select(sv => MapToDTO(sv)).ToList();

            return Ok(studentDTOs);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Failed to retrieve student with id {id}: {ex.Message}");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPut("{id}")]
    [Authorize(Roles = UserRoles.Root + "," + UserRoles.Admin)]
    public async Task<IActionResult> UpdateSinhVien(Guid id, [FromBody] UpdateSinhVienDTO updateDto)
    {
        var userExists = await userManager.FindByIdAsync(id.ToString());
        if (userExists == null)
            return StatusCode(StatusCodes.Status400BadRequest,
                new Response { Status = "Error", Message = "Student not found!" });
        if (userExists.MaLop.ToString() != "")
        {
            var lopExist = await _sinhVienService.GetLopByIdAsync(updateDto.MaLop);
            if (lopExist == null)
                return StatusCode(StatusCodes.Status400BadRequest,
                    new Response { Status = "Error", Message = "Lop is not exists!" });
        }

        userExists.Email = updateDto.Email;
        userExists.UserName = updateDto.Username;
        userExists.DiaChi = updateDto.DiaChi;
        userExists.GioiTinh = updateDto.GioiTinh;
        userExists.HoTen = updateDto.HoTen;
        userExists.NgaySinh = updateDto.NgaySinh;
        userExists.NienKhoa = updateDto.NienKhoa;
        userExists.SoDienThoai = updateDto.SoDienThoai;
        userExists.TrinhDo = updateDto.TrinhDo;
        userExists.MaLop = updateDto.MaLop;
        var result = await userManager.UpdateAsync(userExists);
        if (!result.Succeeded)
            return StatusCode(StatusCodes.Status500InternalServerError,
                new Response
                {
                    Status = "Error", Message = "Student update failed! Please check Student details and try again."
                });
        return Ok(new Response { Status = "Success", Message = "Student update successfully!" });
    }


    [HttpDelete("{id}")]
    [Authorize(Roles = UserRoles.Root + "," + UserRoles.Admin)]
    public async Task<IActionResult> DeleteSinhVien(Guid id)
    {
        try
        {
            var sinhVienToDelete = await userManager.FindByIdAsync(id.ToString());
            if (sinhVienToDelete == null)
            {
                _logger.LogInformation($"SinhVien with id {id} not found.");
                return NotFound("The SinhVien record couldn't be found.");
            }

            var result = await userManager.DeleteAsync(sinhVienToDelete);
            if (result.Succeeded)
            {
                return Ok("Sinh Vien deleted successfully");
            }
            else
            {
                return StatusCode(500, "failed to delete sinh vien");
            }
        }
        catch (Exception ex)
        {
            _logger.LogError($"Failed to delete SinhVien with id {id}: {ex.Message}");
            return StatusCode(500, "Internal server error");
        }
    }


    [HttpGet("GetSinhVienByLopId/{lopId}")]
    [Authorize(Roles = UserRoles.Root + "," + UserRoles.Admin)]
    public async Task<IActionResult> GetSinhVienByLopId(Guid lopId)
    {
        try
        {
            var students = await userManager.GetUsersInRoleAsync(UserRoles.Student);

            // Mapping to DTOs, assuming you have MapToDTO method or using a library like AutoMapper
            var studentDTOs = students.Where(sv => sv.MaLop == lopId).Select(sv => MapToDTO(sv)).ToList();

            return Ok(studentDTOs);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi lấy sinh viên theo Id lớp {LopId}", lopId);
            return StatusCode(500, "Có lỗi xảy ra khi thực hiện yêu cầu");
        }
    }

    [HttpGet("SearchSinhVien")]
    [Authorize(Roles = UserRoles.Root + "," + UserRoles.Admin)]
    public async Task<IActionResult> SearchSinhVien([FromQuery] string searchText)
    {
        try
        {
            var sinhViens = await _sinhVienService.SearchSinhVienAsync(searchText);
            var sinhVienDTOs = sinhViens.Select(sv => MapEntityToDTO(sv));

            return Ok(sinhVienDTOs);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi tìm kiếm sinh viên với từ khóa : '{SearchText}'", searchText);
            return StatusCode(500, "Có lỗi xảy ra khi thực hiện yêu cầu");
        }
    }

    private SinhVienDTO MapEntityToDTO(SinhVien sv)
    {
        return new SinhVienDTO
        {
            Id = sv.Id,
            HoTen = sv.HoTen,
            MaSinhVien = sv.MaSinhVien,
            NgaySinh = sv.NgaySinh,
            Email = sv.Email,
            SoDienThoai = sv.SoDienThoai,
            MaLop = sv.MaLop,
            DiaChi = sv.DiaChi
        };
    }

    private SinhVienDTO MapToDTO(SinhVien sv)
    {
        return new SinhVienDTO
        {
            Id = sv.Id,
            HoTen = sv.HoTen,
            MaSinhVien = sv.MaSinhVien,
            NgaySinh = sv.NgaySinh,
            Email = sv.Email,
            SoDienThoai = sv.SoDienThoai,
            MaLop = sv.MaLop,
            DiaChi = sv.DiaChi,
            GioiTinh = sv.GioiTinh,
            TrinhDo = sv.TrinhDo,
            NienKhoa = sv.NienKhoa
        };
    }
}