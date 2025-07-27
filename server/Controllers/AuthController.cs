using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using SkillUstad.Dto;
using RegisterRequest = SkillUstad.Dto.RegisterRequest;
using LoginRequest = SkillUstad.Dto.LoginRequest;
using SkillUstad.Data;
using Microsoft.EntityFrameworkCore;
using SkillUstad.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SkillUstad.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly SkillUstadDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(SkillUstadDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
            {
                return BadRequest("Email and password are required.");
            }

            // Check in Users table first
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user != null)
            {
                // If user registered via OAuth, password login is not allowed
                if (!string.IsNullOrEmpty(user.OAuthProvider))
                {
                    return BadRequest("Please login using your OAuth provider.");
                }

                bool isPasswordValid = BCrypt.Net.BCrypt.Verify(request.Password, user.Password);
                if (!isPasswordValid)
                {
                    return Unauthorized("Invalid email or password.");
                }

                // Generate JWT token for student
                var token = GenerateJwtToken(user.Id.ToString(), user.Email, user.Name, "Student");

                return Ok(new
                {
                    Message = "Login successful",
                    UserType = "Student",
                    Token = token,
                    User = new
                    {
                        user.Id,
                        user.Name,
                        user.Email,
                        user.ProfilePicture
                    }
                });
            }

            // Check in Mentors table
            var mentor = await _context.Mentors.FirstOrDefaultAsync(m => m.Email == request.Email);
            if (mentor != null)
            {
                // If mentor registered via OAuth, password login is not allowed
                if (!string.IsNullOrEmpty(mentor.OAuthProvider))
                {
                    return BadRequest("Please login using your OAuth provider.");
                }

                bool isPasswordValid = BCrypt.Net.BCrypt.Verify(request.Password, mentor.Password);
                if (!isPasswordValid)
                {
                    return Unauthorized("Invalid email or password.");
                }

                // Generate JWT token for mentor
                var token = GenerateJwtToken(mentor.Id.ToString(), mentor.Email, mentor.Name, "Mentor");

                return Ok(new
                {
                    Message = "Login successful",
                    UserType = "Mentor",
                    Token = token,
                    User = new
                    {
                        mentor.Id,
                        mentor.Name,
                        mentor.Email,
                        mentor.ProfilePicture
                    }
                });
            }

            return Unauthorized("Invalid email or password.");
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            if (string.IsNullOrEmpty(request.UserType))
            {
                return BadRequest("User type is required.");
            }

            // Validate UserType
            if (!request.UserType.Equals("Mentor", StringComparison.OrdinalIgnoreCase) &&
                !request.UserType.Equals("Student", StringComparison.OrdinalIgnoreCase))
            {
                return BadRequest("Invalid user type. Must be 'Student' or 'Mentor'.");
            }

            if (request.UserType.Equals("Mentor", StringComparison.OrdinalIgnoreCase))
            {
                return await RegisterMentor(request);
            }
            else
            {
                return await RegisterStudent(request);
            }
        }

        public async Task<IActionResult> RegisterStudent(RegisterRequest request)
        {
            // Check if user already exists in both tables
            if (await IsEmailExists(request.Email))
            {
                return BadRequest("An account with this email already exists.");
            }

            // Validate Request
            if (string.IsNullOrEmpty(request.Name) || string.IsNullOrEmpty(request.Email))
            {
                return BadRequest("Name and email are required.");
            }

            // Check if OAuth registration
            if (!string.IsNullOrEmpty(request.OAuthProvider) && !string.IsNullOrEmpty(request.OAuthId))
            {
                return await HandleOAuthStudentRegister(request);
            }

            if (string.IsNullOrEmpty(request.Password))
            {
                return BadRequest("Password is required for normal registration.");
            }

            // If not OAuth, handle normal registration
            return await HandleNormalStudentRegister(request);
        }

        public async Task<IActionResult> RegisterMentor(RegisterRequest request)
        {
            // Check if user already exists in both tables
            if (await IsEmailExists(request.Email))
            {
                return BadRequest("An account with this email already exists.");
            }

            // Validate Request
            if (string.IsNullOrEmpty(request.Name) || string.IsNullOrEmpty(request.Email))
            {
                return BadRequest("Name and email are required.");
            }

            // Check if OAuth registration
            if (!string.IsNullOrEmpty(request.OAuthProvider) && !string.IsNullOrEmpty(request.OAuthId))
            {
                return await HandleOAuthMentorRegister(request);
            }

            if (string.IsNullOrEmpty(request.Password))
            {
                return BadRequest("Password is required for normal registration.");
            }

            // If not OAuth, handle normal registration
            return await HandleNormalMentorRegister(request);
        }

        // OAuth Student Registration
        private async Task<IActionResult> HandleOAuthStudentRegister(RegisterRequest request)
        {
            try
            {
                var user = new Users
                {
                    Id = Guid.NewGuid(),
                    Name = request.Name.Trim(),
                    Email = request.Email.Trim().ToLower(),
                    Password = null, // Password is not used for OAuth
                    OAuthProvider = request.OAuthProvider,
                    OAuthId = request.OAuthId,
                    ProfilePicture = request.ProfilePicture,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                await _context.Users.AddAsync(user);
                await _context.SaveChangesAsync();

                // Generate JWT token for OAuth student
                var token = GenerateJwtToken(user.Id.ToString(), user.Email, user.Name, "Student");

                return Ok(new
                {
                    Message = "Student OAuth registration successful",
                    UserType = "Student",
                    Token = token,
                    User = new
                    {
                        user.Id,
                        user.Name,
                        user.Email,
                        user.ProfilePicture
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Registration failed: {ex.Message}");
            }
        }

        // Normal Student Registration
        private async Task<IActionResult> HandleNormalStudentRegister(RegisterRequest request)
        {
            try
            {
                // Hashing Password before insertion
                var hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.Password, workFactor: 12);

                var user = new Users
                {
                    Id = Guid.NewGuid(),
                    Name = request.Name.Trim(),
                    Email = request.Email.Trim().ToLower(),
                    Password = hashedPassword,
                    OAuthProvider = null,
                    OAuthId = null,
                    ProfilePicture = request.ProfilePicture,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                await _context.Users.AddAsync(user);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    Message = "Student registration successful. Please login to continue.",
                    UserType = "Student",
                    User = new
                    {
                        user.Id,
                        user.Name,
                        user.Email,
                        user.ProfilePicture
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Registration failed: {ex.Message}");
            }
        }

        // OAuth Mentor Registration
        private async Task<IActionResult> HandleOAuthMentorRegister(RegisterRequest request)
        {
            try
            {
                var mentor = new Mentor
                {
                    Id = Guid.NewGuid(),
                    Name = request.Name.Trim(),
                    Email = request.Email.Trim().ToLower(),
                    Password = null, // Password is not used for OAuth
                    OAuthProvider = request.OAuthProvider,
                    OAuthId = request.OAuthId,
                    ProfilePicture = request.ProfilePicture,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                await _context.Mentors.AddAsync(mentor);
                await _context.SaveChangesAsync();

                // Generate JWT token for OAuth mentor
                var token = GenerateJwtToken(mentor.Id.ToString(), mentor.Email, mentor.Name, "Mentor");

                return Ok(new
                {
                    Message = "Mentor OAuth registration successful",
                    UserType = "Mentor",
                    Token = token,
                    User = new
                    {
                        mentor.Id,
                        mentor.Name,
                        mentor.Email,
                        mentor.ProfilePicture
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Registration failed: {ex.Message}");
            }
        }

        // Normal Mentor Registration
        private async Task<IActionResult> HandleNormalMentorRegister(RegisterRequest request)
        {
            try
            {
                // Hashing Password before insertion
                var hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.Password, workFactor: 12);

                var mentor = new Mentor
                {
                    Id = Guid.NewGuid(),
                    Name = request.Name.Trim(),
                    Email = request.Email.Trim().ToLower(),
                    Password = hashedPassword,
                    OAuthProvider = null,
                    OAuthId = null,
                    ProfilePicture = request.ProfilePicture,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                await _context.Mentors.AddAsync(mentor);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    Message = "Mentor registration successful. Please login to continue.",
                    UserType = "Mentor",
                    User = new
                    {
                        mentor.Id,
                        mentor.Name,
                        mentor.Email,
                        mentor.ProfilePicture
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Registration failed: {ex.Message}");
            }
        }

        // JWT Token Generation Method
        private string GenerateJwtToken(string userId, string email, string name, string userType)
        {
            var jwtConfig = _configuration.GetSection("Jwt");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtConfig["Key"]));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, userId),
                new Claim(JwtRegisteredClaimNames.Email, email),
                new Claim(JwtRegisteredClaimNames.Name, name),
                new Claim("UserType", userType),
                new Claim("UserId", userId),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.Iat,
                    new DateTimeOffset(DateTime.UtcNow).ToUnixTimeSeconds().ToString(),
                    ClaimValueTypes.Integer64)
            };

            var token = new JwtSecurityToken(
                issuer: jwtConfig["Issuer"],
                audience: jwtConfig["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddDays(7), // Token expires in 7 days
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        // Check if email exists in either Users or Mentors table
        private async Task<bool> IsEmailExists(string email)
        {
            if (string.IsNullOrEmpty(email))
                return false;

            var normalizedEmail = email.Trim().ToLower();

            // Check in Users table
            var userExists = await _context.Users.AnyAsync(u => u.Email == normalizedEmail);
            if (userExists)
                return true;

            // Check in Mentors table
            var mentorExists = await _context.Mentors.AnyAsync(m => m.Email == normalizedEmail);
            return mentorExists;
        }

        // Helper method to get user type by email (useful for other operations)
        private async Task<string?> GetUserTypeByEmail(string email)
        {
            if (string.IsNullOrEmpty(email))
                return null;

            var normalizedEmail = email.Trim().ToLower();

            var userExists = await _context.Users.AnyAsync(u => u.Email == normalizedEmail);
            if (userExists)
                return "Student";

            var mentorExists = await _context.Mentors.AnyAsync(m => m.Email == normalizedEmail);
            if (mentorExists)
                return "Mentor";

            return null;
        }

        // Endpoint to verify token and get user info
        [HttpGet("verify")]
        [Microsoft.AspNetCore.Authorization.Authorize]
        public async Task<IActionResult> VerifyToken()
        {
            try
            {
                var userId = User.FindFirst("UserId")?.Value;
                var userType = User.FindFirst("UserType")?.Value;
                var email = User.FindFirst(JwtRegisteredClaimNames.Email)?.Value;

                if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(userType))
                {
                    return Unauthorized("Invalid token.");
                }

                if (userType == "Student")
                {
                    var user = await _context.Users.FirstOrDefaultAsync(u => u.Id.ToString() == userId);
                    if (user == null)
                    {
                        return NotFound("User not found.");
                    }

                    return Ok(new
                    {
                        Message = "Token is valid",
                        UserType = "Student",
                        User = new
                        {
                            user.Id,
                            user.Name,
                            user.Email,
                            user.ProfilePicture
                        }
                    });
                }
                else if (userType == "Mentor")
                {
                    var mentor = await _context.Mentors.FirstOrDefaultAsync(m => m.Id.ToString() == userId);
                    if (mentor == null)
                    {
                        return NotFound("Mentor not found.");
                    }

                    return Ok(new
                    {
                        Message = "Token is valid",
                        UserType = "Mentor",
                        User = new
                        {
                            mentor.Id,
                            mentor.Name,
                            mentor.Email,
                            mentor.ProfilePicture
                        }
                    });
                }

                return BadRequest("Invalid user type.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Token verification failed: {ex.Message}");
            }
        }
    }
}
