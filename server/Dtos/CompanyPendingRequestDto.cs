namespace SkillUstad.Dtos
{
    public class CompanyPendingRequestDto
    {
        public int Id { get; set; }
        public string CompanyName { get; set; } = string.Empty;
        public string WorkEmail { get; set; } = string.Empty;
        public string Website { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
