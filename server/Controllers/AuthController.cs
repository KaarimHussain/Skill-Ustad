using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using SkillUstad.Dto;
using RegisterRequest = SkillUstad.Dto.RegisterRequest;
using LoginRequest = SkillUstad.Dto.LoginRequest;
using SkillUstad.Data;
using Microsoft.EntityFrameworkCore;
using SkillUstad.Models;

namespace SkillUstad.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly SkillUstadDbContext _context;
        public AuthController(SkillUstadDbContext context)
        {
            _context = context;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            // Handle login logic
            return Ok(new { Message = "Login successful" });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            // Check if user already exists
            if (await IsUserExists(request.Email))
            {
                return BadRequest("Unable to process registration.");
            }
            // Validate Request
            if (string.IsNullOrEmpty(request.Name) || string.IsNullOrEmpty(request.Email))
            {
                return BadRequest("Provided credentials are incomplete.");
            }
            // Check if OAuth registration
            if (!string.IsNullOrEmpty(request.OAuthProvider) && !string.IsNullOrEmpty(request.OAuthId))
            {
                return await handleOAuthRegister(request);
            }
            if (string.IsNullOrEmpty(request.Password))
            {
                return BadRequest("Provided credentials are incomplete.");
            }
            // If not OAuth, handle normal registration
            return await handleNormalRegister(request);
        }
        private async Task<IActionResult> handleOAuthRegister(RegisterRequest request)
        {
            var user = new Users
            {
                Name = request.Name,
                Email = request.Email,
                Password = null, // Password is not used for OAuth
                OAuthProvider = request.OAuthProvider,
                OAuthId = request.OAuthId,
                ProfilePicture = request.ProfilePicture
            };

            // Send the Data
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
            // Return success response
            return Ok(new { Message = "OAuth registration successful" });
        }
        private async Task<IActionResult> handleNormalRegister(RegisterRequest request)
        {
            // Hashing Password before insertion
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.Password, workFactor: 12);

            var user = new Users
            {
                Name = request.Name,
                Email = request.Email,
                Password = hashedPassword, // Use the provided password
                OAuthProvider = null, // No OAuth provider for normal registration
                OAuthId = null, // No OAuth ID for normal registration
                ProfilePicture = request.ProfilePicture
            };

            // Send the Data
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
            // Return success response
            return Ok(new { Message = "Registration successful" });
        }
        private async Task<bool> IsUserExists(string email)
        {
            // Check if user already exists in the database
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user != null)
            {
                return true;
            }
            return false;
        }
    }
}