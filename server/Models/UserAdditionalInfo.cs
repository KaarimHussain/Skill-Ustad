using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SkillUstad.Models
{
    public class UserAdditionalInfo
    {
        [Required]
        public Guid Id { get; set; }

        [Required]
        public Guid UserId { get; set; }

        public string? CurrentLevelOfEducation { get; set; }
        public string? LevelOfExpertise { get; set; }
        public string? FieldOfExpertise { get; set; }
        public string? UserInterestsAndGoals { get; set; }
        public string? Gender { get; set; }
        public string? City { get; set; }
        public string? Address { get; set; }

        // Navigation Property
        [ForeignKey("UserId")]
        public virtual Users User { get; set; } = null!;
    }
}