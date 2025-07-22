using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;

namespace SkillUstad.Models
{
    public class MentorExpertiseTag
    {
        [Required]
        public Guid Id { get; set; }

        [Required]
        public Guid MentorId { get; set; }

        [Required, NotNull]
        public string TagName { get; set; } = null!;

        // Navigation Property
        [ForeignKey("MentorId")]
        public virtual Mentor Mentor { get; set; } = null!;
    }
}