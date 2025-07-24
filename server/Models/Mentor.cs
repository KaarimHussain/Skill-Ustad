using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace SkillUstad.Models
{
    public class Mentor
    {

        [Required]
        public Guid Id { get; set; }

        [Required, NotNull]
        public string Name { get; set; } = null!;

        [Required, EmailAddress, NotNull]
        public string Email { get; set; } = null!;

        // Make Password optional (null if OAuth)
        [DataType(DataType.Password)]
        public string? Password { get; set; } = null;

        // NEW: OAuth provider (google, github, etc.)
        public string? OAuthProvider { get; set; } = null;

        // NEW: OAuth unique ID from the provider
        public string? OAuthId { get; set; } = null;

        // Profile Picture can be null 
        // The Profile Picture will be stored on cloud the service name is Cloudinary
        public string? ProfilePicture { get; set; } = null;

        public DateTime UpdatedAt { get; set; } = DateTime.Now;
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        // Navigation Properties
        public virtual MentorAdditionalInfo? MentorAdditionalInfo { get; set; }
        public virtual ICollection<MentorExpertiseTag> ExpertiseTags { get; set; } = new List<MentorExpertiseTag>();
        public virtual ICollection<SpokenLanguage> SpokenLanguages { get; set; } = new List<SpokenLanguage>();
    }
}