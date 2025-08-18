using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SkillUstad.Data;
using SkillUstad.Dto;
using SkillUstad.Models;
using SkillUstad.Service;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace SkillUstad.Controller
{
    [ApiController]
    [Route("api/forget-password")]
    public class ForgetPasswordController : ControllerBase
    {
        private readonly SkillUstadDbContext _db;
        private readonly EmailService _emailService;
        private readonly IConfiguration _config;

        public ForgetPasswordController(SkillUstadDbContext db, EmailService emailService, IConfiguration config)
        {
            _db = db;
            _emailService = emailService;
            _config = config;
        }

        [HttpPost("request")]
        public async Task<IActionResult> RequestPasswordReset([FromBody] ForgotPasswordRequestDto request)
        {
            if (string.IsNullOrWhiteSpace(request.Email))
                return BadRequest(new { message = "Email is required" });

            // Check if user exists
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null)
            {
                return BadRequest(new { message = "Invalid Email Address!" });
            }

            // Check if user is OAuth-based
            if (!string.IsNullOrEmpty(user.OAuthId) || !string.IsNullOrEmpty(user.OAuthProvider))
            {
                return BadRequest(new { message = "Password reset not available for OAuth accounts" });
            }

            // Generate token & expiry
            var rawToken = Convert.ToBase64String(RandomNumberGenerator.GetBytes(32));
            var expiry = DateTime.UtcNow.AddMinutes(15);

            // Save token to DB (temporary table)
            var resetRequest = new PasswordResetRequest
            {
                Id = Guid.NewGuid(),
                UserId = user.Id,
                Token = rawToken,
                ExpiresAt = expiry,
                IsUsed = false
            };
            _db.PasswordResetRequests.Add(resetRequest);
            await _db.SaveChangesAsync();

            // Build reset link
            var resetLink = $"{_config["FrontendUrl"]}/reset-password?token={Uri.EscapeDataString(rawToken)}&uid={user.Id}";

            // Send email
            var emailBody = $@"
                <p>Hello {user.Name},</p>
                <p>We received a request to reset your SkillUstad password.</p>
                <p><a href='{resetLink}'>Click here to reset your password</a></p>
                <p>This link will expire in 15 minutes.</p>
            ";
            await _emailService.SendEmailAsync(user.Email, "SkillUstad Password Reset", emailBody);

            return Ok(new { message = "If this email exists, a reset link has been sent" });
        }

        [HttpPost("resend")]
        public async Task<IActionResult> ResendEmail([FromBody] ForgotPasswordRequestDto request)
        {
            if (string.IsNullOrWhiteSpace(request.Email))
                return BadRequest(new { message = "Email is required." });

            var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null)
                return NotFound(new { message = "No account found with that email." });

            if (!string.IsNullOrEmpty(user.OAuthId) || !string.IsNullOrEmpty(user.OAuthProvider))
                return BadRequest(new { message = "OAuth account. Please sign in with Google." });

            var latestReset = await _db.PasswordResetRequests
                .Where(r => r.UserId == user.Id && !r.IsUsed && r.ExpiresAt > DateTime.UtcNow)
                .OrderByDescending(r => r.ExpiresAt)
                .FirstOrDefaultAsync();

            string resetToken;

            if (latestReset == null)
            {
                // No active reset request - create a new one
                resetToken = Convert.ToBase64String(RandomNumberGenerator.GetBytes(32));
                var expiry = DateTime.UtcNow.AddMinutes(15);

                var newResetRequest = new PasswordResetRequest
                {
                    Id = Guid.NewGuid(),
                    UserId = user.Id,
                    Token = resetToken,
                    ExpiresAt = expiry,
                    IsUsed = false
                };

                _db.PasswordResetRequests.Add(newResetRequest);
                await _db.SaveChangesAsync();
            }
            else
            {
                // Use existing active token
                resetToken = latestReset.Token;
            }

            var frontendUrl = _config["FrontendUrl"] ?? "http://localhost:5173";
            var resetLink = $"{frontendUrl}/reset-password?token={Uri.EscapeDataString(resetToken)}&uid={user.Id}";

            await _emailService.SendPasswordResetEmail(user.Email, resetLink);

            return Ok(new { message = "Password reset email sent successfully." });
        }

        [HttpPost("reset")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto request)
        {
            if (string.IsNullOrEmpty(request.Token) || string.IsNullOrEmpty(request.NewPassword))
                return BadRequest(new { message = "Token and new password are required." });

            try
            {
                var passwordResetRequest = await _db.PasswordResetRequests
                    .Include(pr => pr.User)
                    .FirstOrDefaultAsync(q => q.Token == request.Token);

                if (passwordResetRequest == null)
                {
                    return Unauthorized(new { message = "Un-Authorize user request!" });
                }

                // Check if token has expired
                if (DateTime.UtcNow > passwordResetRequest.ExpiresAt)
                {
                    return BadRequest(new { message = "Token has expired. Please request a new password reset." });
                }

                // Check if token has already been used
                if (passwordResetRequest.IsUsed)
                {
                    return BadRequest(new { message = "Token has already been used. Please request a new password reset." });
                }

                // Get the user
                var user = passwordResetRequest.User;
                if (user == null)
                {
                    return NotFound(new { message = "User not found." });
                }

                string hashedPassword = HashPassword(request.NewPassword);

                // Update user's password
                user.Password = hashedPassword; // Adjust property name as per your Users model

                // Mark the token as used
                passwordResetRequest.IsUsed = true;

                // Save changes to database
                await _db.SaveChangesAsync();

                return Ok(new { message = "Password reset successfully." });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return BadRequest(new { message = "An error occurred while resetting password.", error = ex.Message });
            }
        }

        private string HashPassword(string newPassword)
        {
            return BCrypt.Net.BCrypt.HashPassword(newPassword);
        }
    }
}
