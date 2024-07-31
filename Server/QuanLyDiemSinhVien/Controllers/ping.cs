using Microsoft.AspNetCore.Mvc;

namespace asd123.Controllers;

[Route("api/[controller]")]
[ApiController]
public class PingController : ControllerBase
{
    [HttpGet]
    public IActionResult Index()
    {
        return Ok("pong");
    }
}