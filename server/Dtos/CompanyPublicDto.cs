namespace SkillUstad.Dto
{
    public class CompanyPublicDto
    {
        public int Id { get; set; }
        public string CompanyName { get; set; } = string.Empty;
        public string WorkEmail { get; set; } = string.Empty;
        public string Website { get; set; } = string.Empty;
        public string? ContactPersonName { get; set; }
        public string? ContactPersonTitle { get; set; }
        public string? WorkPhone { get; set; }
        public string? Industry { get; set; }
        public string? BusinessType { get; set; }
        public string? Country { get; set; }
        public string? City { get; set; }
        public int? EmployeeCount { get; set; }
        public string? CompanyDescription { get; set; }
        public string? LinkedInUrl { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
