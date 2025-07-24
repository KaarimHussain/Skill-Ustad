using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace SkillUstad.Models
{
    public class Users
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

        // Profile Picture stored in Cloudinary (optional)
        public string? ProfilePicture { get; set; } = null;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        public virtual UserAdditionalInfo? UserAdditionalInfo { get; set; }
        public virtual ICollection<SpokenLanguage> SpokenLanguages { get; set; } = new List<SpokenLanguage>();
    }
}
