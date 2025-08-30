namespace SkillUstad.Dto
{
    public class CompaniesRegisterRequest
    {
        public string CompanyName { get; set; } = string.Empty;
        public string CompanyEmail { get; set; } = string.Empty;
        public string Website { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}