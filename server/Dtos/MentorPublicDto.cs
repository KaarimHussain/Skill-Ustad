namespace SkillUstad.Dto
{
    public class MentorPublicDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? ProfilePicture { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? Bio { get; set; }
        public string? LevelOfExpertise { get; set; }
        public string? FieldOfExpertise { get; set; }
        public string? IndustryExperience { get; set; }
        public string? Gender { get; set; }
        public string? City { get; set; }
        // Assuming MentorExpertiseTag has a string property 'Tag'
        public List<string>? ExpertiseTags { get; set; }
        // Assuming SpokenLanguage has a string property 'Language'
        public List<string>? SpokenLanguages { get; set; }
    }
}
