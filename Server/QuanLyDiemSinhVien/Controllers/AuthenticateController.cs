using asd123.Biz.Roles;
using asd123.Helpers;
using asd123.Model;
using asd123.Presenters;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using asd123.DTO;
using asd123.Services;
using asd123.Ultil;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace asd123.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticateController : ControllerBase
    {
        private readonly UserManager<SinhVien> userManager;
        private readonly SignInManager<SinhVien> signInManager;
        private readonly RoleManager<IdentityRole<Guid>> roleManager;
        private readonly IConfiguration _configuration;
        private readonly ISinhVien _sinhVienService;

        public AuthenticateController(
            ISinhVien sinhVienService,
            UserManager<SinhVien> userManager,
            SignInManager<SinhVien> signInManager,
            RoleManager<IdentityRole<Guid>> roleManager,
            IConfiguration configuration)
        {
            this.userManager = userManager;
            _sinhVienService = sinhVienService;
            this.signInManager = signInManager;
            this.roleManager = roleManager;
            _configuration = configuration;
        }

        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Login([FromBody] asd123.Presenters.LoginModel model)
        {
            var user = await userManager.FindByNameAsync(model.Username);
            if (user != null && await userManager.CheckPasswordAsync(user, model.Password))
            {
                var userRoles = await userManager.GetRolesAsync(user);

                var authClaims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, user.UserName),
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                };

                foreach (var userRole in userRoles)
                {
                    authClaims.Add(new Claim(ClaimTypes.Role, userRole));
                }

                var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]));

                var token = new JwtSecurityToken(
                    issuer: _configuration["JWT:ValidIssuer"],
                    audience: _configuration["JWT:ValidAudience"],
                    expires: DateTime.Now.AddHours(3),
                    claims: authClaims,
                    signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
                );

                return Ok(new
                {
                    token = new JwtSecurityTokenHandler().WriteToken(token),
                    expiration = token.ValidTo
                });
            }

            return Unauthorized();
        }

        [Authorize]
        [HttpPost]
        [Route("logout")]
        public async Task<IActionResult> Logout()
        {
            await signInManager.SignOutAsync();
            return Ok(new Response { Status = "Success", Message = "Logged out successfully!" });
        }

        [HttpPost]
        [Route("register")]
        //[Authorize(UserRoles.Root)]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            var userExists = await userManager.FindByNameAsync(model.Username);
            if (userExists != null)
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new Response { Status = "Error", Message = "User already exists!" });

            SinhVien user = new SinhVien()
            {
                Email = model.Email,
                SecurityStamp = Guid.NewGuid().ToString(),
                UserName = model.Username,
                DiaChi = model.DiaChi,
                GioiTinh = model.GioiTinh,
                HoTen = model.HoTen,
                NgaySinh = model.NgaySinh,
                MaSinhVien = "",
                NienKhoa = "",
                SoDienThoai = model.SoDienThoai,
                TrinhDo = ""
            };

            var result = await userManager.CreateAsync(user, model.Password);
            if (!result.Succeeded)
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new Response
                    {
                        Status = "Error", Message = "User creation failed! Please check user details and try again."
                    });

            var usersCount = await userManager.Users.CountAsync();
            if (usersCount == 1)
            {
                if (!await roleManager.RoleExistsAsync(UserRoles.Root))
                    await roleManager.CreateAsync(new IdentityRole<Guid>(UserRoles.Root));
                await userManager.AddToRoleAsync(user, UserRoles.Root);
            }
            else
            {
                if (!await roleManager.RoleExistsAsync(UserRoles.Admin))
                    await roleManager.CreateAsync(new IdentityRole<Guid>(UserRoles.Admin));
                await userManager.AddToRoleAsync(user, UserRoles.Admin);
            }

            return Ok(new Response { Status = "Success", Message = "User created successfully!" });
        }

        [Authorize]
        [HttpPost]
        [Route("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordModel model)
        {
            var user = await userManager.GetUserAsync(User);
            if (user == null)
                return NotFound(new Response { Status = "Error", Message = "User not found!" });
            if (model.NewPassword != model.ConfirmPassword)
            {
                return BadRequest(new Response { Status = "Error", Message = "Failed to change password!" });
            }

            var result = await userManager.ChangePasswordAsync(user, model.CurrentPassword, model.NewPassword);
            if (!result.Succeeded)
                return BadRequest(new Response { Status = "Error", Message = "Failed to change password!" });

            return Ok(new Response { Status = "Success", Message = "Password changed successfully!" });
        }

        [HttpPut("ResetPassword")]
        [Authorize(Roles = UserRoles.Root + "," + UserRoles.Admin)]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDTO model)
        {
            try
            {
                var user = await userManager.FindByIdAsync(model.Id.ToString());
                if (user == null)
                {
                    return NotFound("User not found");
                }

                var token = await userManager.GeneratePasswordResetTokenAsync(user);
                var result = await userManager.ResetPasswordAsync(user, token, base_pw.password_Default);
                if (result.Succeeded)
                {
                    return Ok("Password reset successfully");
                }
                else
                {
                    return StatusCode(500, "Failed to reset password");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, "server error");
            }
        }
        // [HttpPost]
        // [Route("register-teacher")]
        // //[Authorize(Roles = UserRoles.Root)]
        // public async Task<IActionResult> RegisterTeacher([FromBody] RegisterTeacherModel model)
        // {
        //     var userExists = await userManager.FindByNameAsync(model.Username);
        //     if (userExists != null)
        //         return StatusCode(StatusCodes.Status500InternalServerError,
        //             new Response { Status = "Error", Message = "User already exists!" });
        //     var lopExist = await _sinhVienService.GetLopByIdAsync(model.MaLop);
        //     if (lopExist == null)
        //         return StatusCode(StatusCodes.Status400BadRequest,
        //             new Response { Status = "Error", Message = "Lop is not exists!" });
        //     SinhVien user = new SinhVien()
        //     {
        //         Email = model.Email,
        //         SecurityStamp = Guid.NewGuid().ToString(),
        //         UserName = model.Username,
        //         DiaChi = model.DiaChi,
        //         GioiTinh = model.GioiTinh,
        //         HoTen = model.HoTen,
        //         MaSinhVien = "",
        //         NienKhoa = "",
        //         SoDienThoai = model.SoDienThoai,
        //         TrinhDo = "",
        //         MaLop = model.MaLop
        //     };
        //
        //     var result = await userManager.CreateAsync(user, "240@Ispace");
        //     if (!result.Succeeded)
        //         return StatusCode(StatusCodes.Status500InternalServerError,
        //             new Response
        //             {
        //                 Status = "Error", Message = "Teacher creation failed! Please check user details and try again."
        //             });
        //
        //
        //     if (!await roleManager.RoleExistsAsync(UserRoles.Teacher))
        //         await roleManager.CreateAsync(new IdentityRole<Guid>(UserRoles.Teacher));
        //     await userManager.AddToRoleAsync(user, UserRoles.Teacher);
        //
        //
        //     return Ok(new Response { Status = "Success", Message = "Teacher created successfully!" });
        // }
    }
}