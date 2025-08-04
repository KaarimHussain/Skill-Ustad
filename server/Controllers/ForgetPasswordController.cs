using Microsoft.AspNetCore.Mvc;
using SkillUstad.Dto;

namespace SkillUstad.Controller
{
    [ApiController]
    [Route("api/forget-password")]
    public class ForgetPasswordController : ControllerBase
    {
        private readonly SkillUstad.Data.SkillUstadDbContext _db;
        private readonly SkillUstad.Service.EmailService _emailService;

        public ForgetPasswordController(SkillUstad.Data.SkillUstadDbContext db, SkillUstad.Service.EmailService emailService)
        {
            _db = db;
            _emailService = emailService;
        }

        [HttpPost("request")]
        public async Task<IActionResult> RequestReset([FromBody] string email)
        {
            var user = _db.Users.FirstOrDefault(u => u.Email == email);
            if (user == null)
                return NotFound("User not found");

            var otp = new Random().Next(100000, 999999).ToString();
            var expiresAt = DateTime.UtcNow.AddMinutes(10);

            var resetRequest = new SkillUstad.Models.OtpRequest
            {
                OTP = otp,
                IsVerified = false,
                CreatedAt = DateTime.UtcNow,
                ExpiresAt = expiresAt,
                UserId = user.Id.ToString(),
                User = user
            };
            _db.Add(resetRequest);
            await _db.SaveChangesAsync();

            await _emailService.SendOtpEmailAsync(email, otp);
            return Ok("OTP sent to email");
        }

        [HttpPost("verify")]
        public async Task<IActionResult> VerifyOtp([FromBody] VerifyOtpDto dto)
        {
            var request = _db.Set<SkillUstad.Models.OtpRequest>()
                .FirstOrDefault(r => r.UserId == dto.UserId && r.OTP == dto.OTP && r.ExpiresAt > DateTime.UtcNow);
            if (request == null)
                return BadRequest("Invalid or expired OTP");

            request.IsVerified = true;
            await _db.SaveChangesAsync();
            return Ok("OTP verified");
        }

        [HttpPost("reset")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
        {
            var request = _db.Set<SkillUstad.Models.OtpRequest>()
                .FirstOrDefault(r => r.UserId == dto.UserId && r.IsVerified && r.ExpiresAt > DateTime.UtcNow);
            if (request == null)
                return BadRequest("OTP not verified or expired");

            var user = _db.Users.FirstOrDefault(u => u.Id.ToString() == dto.UserId);
            if (user == null)
                return NotFound("User not found");

            user.Password = dto.NewPassword; // Hash in production
            await _db.SaveChangesAsync();
            return Ok("Password reset successful");
        }
    }
}