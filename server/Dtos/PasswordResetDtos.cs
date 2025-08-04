namespace SkillUstad.Dto
{
    public class VerifyOtpDto
    {
        public string UserId { get; set; } = null!;
        public string OTP { get; set; } = null!;
    }

    public class ResetPasswordDto
    {
        public string UserId { get; set; } = null!;
        public string NewPassword { get; set; } = null!;
    }
}
