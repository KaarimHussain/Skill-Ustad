using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SkillUstad.Models
{
    public class MentorAdditionalInfo
    {
        [Required]
        public Guid Id { get; set; }

        [Required]
        public Guid MentorId { get; set; }

        public string? Bio { get; set; }

        // Note: Removed List<string>? Tag as it's better handled by MentorExpertiseTag
        // If you need additional tags, consider creating another junction table

        public string? LevelOfExpertise { get; set; }
        public string? FieldOfExpertise { get; set; }
        public string? IndustryExperience { get; set; }
        public string? Gender { get; set; }
        public string? City { get; set; }
        public string? Address { get; set; }

        // Navigation Property
        [ForeignKey("MentorId")]
        public virtual Mentor Mentor { get; set; } = null!;

    }
}