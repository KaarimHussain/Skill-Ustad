namespace SkillUstad.Dto
{
    public class VerifyOtpRequest
    {
        public string Email { get; set; }
        public string Otp { get; set; }
    }

    public class ResendOtpRequest
    {
        public string Email { get; set; }
    }
}