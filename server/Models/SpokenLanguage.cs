using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SkillUstad.Models
{
    public class SpokenLanguage
    {
        [Required]
        public Guid Id { get; set; }

        [Required]
        public Guid UserId { get; set; }

        // Added UserType to distinguish between Users and Mentors
        [Required]
        public string UserType { get; set; } = null!; // "User" or "Mentor"

        public string? Language { get; set; } = "English";

        // Navigation Properties - One of these will be null based on UserType
        [ForeignKey("UserId")]
        public virtual Users? User { get; set; }

        [ForeignKey("UserId")]
        public virtual Mentor? Mentor { get; set; }
    }
}