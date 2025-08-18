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
using SkillUstad.Service;

namespace SkillUstad.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly SkillUstadDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly EmailService _emailService;

        public AuthController(SkillUstadDbContext context, IConfiguration configuration, EmailService emailService)
        {
            _context = context;
            _configuration = configuration;
            _emailService = emailService;

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

                // Checking if the account is verified
                var isVerified = await _context.UserVerifications.AnyAsync(q => q.AccountId == user.Id && q.IsEmailVerified == true);
                if (!isVerified)
                {
                    return Unauthorized(new { message = "The Account is not verified.", otpError = true, otpEmail = user.Email });
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

                // Checking if the account is verified
                var isVerified = await _context.UserVerifications.AnyAsync(q => q.AccountId == mentor.Id && q.IsEmailVerified == true);
                if (!isVerified)
                {
                    return Unauthorized("The Account is not verified.");
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

        [HttpPost("google-login")]
        public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginRequest request)
        {
            if (string.IsNullOrEmpty(request.IdToken))
            {
                return BadRequest("Google ID token is required.");
            }
            System.Console.WriteLine("Google ID Token: " + request.IdToken);
            // Check if user already exists in Users table
            var user = await _context.Users.FirstOrDefaultAsync(u => u.OAuthId == request.IdToken);
            var mentor = await _context.Mentors.FirstOrDefaultAsync(m => m.OAuthId == request.IdToken);
            System.Console.WriteLine("Founded User :" + user?.Name);
            System.Console.WriteLine("Founded Mentor :" + mentor?.Name);
            if (user != null)
            {
                // If user exists, generate JWT token
                return await GoogleLoginUser(user);
            }
            else if (mentor != null)
            {
                // If mentor exists, generate JWT token
                return await GoogleLoginMentor(mentor);
            }
            else
            {
                // if user does not exist, send an error message
                return BadRequest("User not found. Please register first.");
            }
        }

        private async Task<IActionResult> GoogleLoginUser(Users user)
        {
            var userType = await GetUserTypeByEmail(user.Email);
            if (userType == null)
            {
                return BadRequest("User type not found. Please register first.");
            }
            // Generate JWT token for existing user
            var token = GenerateJwtToken(user.Id.ToString(), user.Email, user.Name, userType);

            return Ok(new
            {
                Message = "Login successful",
                UserType = userType,
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

        private async Task<IActionResult> GoogleLoginMentor(Mentor mentor)
        {
            var userType = await GetUserTypeByEmail(mentor.Email);
            if (userType == null)
            {
                return BadRequest("User type not found. Please register first.");
            }
            // Generate JWT token for existing user
            var token = GenerateJwtToken(mentor.Id.ToString(), mentor.Email, mentor.Name, userType);

            return Ok(new
            {
                Message = "Login successful",
                UserType = userType,
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

                // 3️⃣ Create verification row
                var verification = new UserVerification
                {
                    Id = Guid.NewGuid(),
                    AccountType = "User", // or "Mentor"
                    AccountId = user.Id,
                    IsEmailVerified = false
                };
                await _context.UserVerifications.AddAsync(verification);

                // 4️⃣ Generate OTP
                var otp = new Random().Next(100000, 999999).ToString();
                var emailOtp = new EmailOtp
                {
                    Id = Guid.NewGuid(),
                    AccountId = user.Id,
                    UserType = "User", // or "Mentor"
                    OtpCode = otp,
                    ExpiresAt = DateTime.UtcNow.AddMinutes(15),
                    IsUsed = false
                };
                await _context.EmailOtps.AddAsync(emailOtp);
                // Save Database Changes
                await _context.SaveChangesAsync();

                // 5️⃣ Send OTP via email
                await _emailService.SendEmailConformationEmail(user.Email, int.Parse(otp));

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

                // 3️⃣ Create verification row
                var verification = new UserVerification
                {
                    Id = Guid.NewGuid(),
                    AccountId = mentor.Id,
                    AccountType = "Mentor", // or "User"
                    IsEmailVerified = false
                };
                await _context.UserVerifications.AddAsync(verification);

                // 4️⃣ Generate OTP
                var otp = new Random().Next(100000, 999999).ToString();
                var emailOtp = new EmailOtp
                {
                    Id = Guid.NewGuid(),
                    AccountId = mentor.Id,
                    UserType = "Mentor", // or "User"
                    OtpCode = otp,
                    ExpiresAt = DateTime.UtcNow.AddMinutes(15),
                    IsUsed = false
                };
                await _context.EmailOtps.AddAsync(emailOtp);

                await _context.SaveChangesAsync();

                // 5️⃣ Send OTP via email
                await _emailService.SendEmailConformationEmail(mentor.Email, int.Parse(otp));

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

        [HttpPost("verify-otp")]
        public async Task<IActionResult> VerifyOtp([FromBody] VerifyOtpRequest request)
        {
            // Check if email exists in either table
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            var mentor = user == null
                ? await _context.Mentors.FirstOrDefaultAsync(m => m.Email == request.Email)
                : null;

            if (user == null && mentor == null)
                return BadRequest(new { message = "Account not found" });

            var accountId = user?.Id ?? mentor!.Id;
            var accountType = user != null ? "User" : "Mentor";

            // Find OTP
            var otpRecord = await _context.EmailOtps
                .Where(o => o.AccountId == accountId && o.UserType == accountType && !o.IsUsed && o.OtpCode == request.Otp)
                .OrderByDescending(o => o.CreatedAt)
                .FirstOrDefaultAsync();

            if (otpRecord == null)
                return BadRequest(new { message = "Invalid OTP" });

            if (DateTime.UtcNow > otpRecord.ExpiresAt)
                return BadRequest(new { message = "OTP expired" });

            // Mark OTP as used
            otpRecord.IsUsed = true;

            // Mark email as verified in UserVerification table
            var verification = await _context.UserVerifications
                .FirstOrDefaultAsync(v => v.AccountId == accountId);

            if (verification == null)
            {
                verification = new UserVerification
                {
                    Id = Guid.NewGuid(),
                    AccountId = accountId,
                    IsEmailVerified = true,
                    VerifiedAt = DateTime.UtcNow
                };
                _context.UserVerifications.Add(verification);
            }
            else
            {
                verification.IsEmailVerified = true;
                verification.VerifiedAt = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Email verified successfully" });
        }


        [HttpPost("resend-otp")]
        public async Task<IActionResult> ResendOtp([FromBody] ResendOtpRequest request)
        {
            // Check if email exists in either table
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            var mentor = user == null
                ? await _context.Mentors.FirstOrDefaultAsync(m => m.Email == request.Email)
                : null;

            if (user == null && mentor == null)
                return BadRequest(new { message = "Account not found" });

            var accountId = user?.Id ?? mentor!.Id;
            var accountType = user != null ? "User" : "Mentor";

            // Find OTP
            var otpRecord = await _context.EmailOtps
                .Where(o => o.AccountId == accountId)
                .OrderByDescending(o => o.CreatedAt).ToListAsync();

            if (otpRecord.Count > 1)
            {
                foreach (var expiredOtp in otpRecord)
                {
                    expiredOtp.IsUsed = true;
                }
            }
            var otp = new Random().Next(100000, 999999).ToString();
            var newOtp = new EmailOtp
            {
                Id = Guid.NewGuid(),
                AccountId = accountId,
                UserType = accountType,
                OtpCode = otp,
                ExpiresAt = DateTime.UtcNow.AddMinutes(15),
                IsUsed = false
            };

            _context.EmailOtps.Add(newOtp);
            await _context.SaveChangesAsync();

            // 5️⃣ Send OTP via email
            await _emailService.SendEmailConformationEmail(request.Email, int.Parse(otp));

            return Ok(new { message = "OTP resent successfully" });
        }
    }
}
