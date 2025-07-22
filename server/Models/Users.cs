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

        [Required, NotNull, DataType(DataType.Password)]
        public string Password { get; set; } = null!;

        // Profile Picture can be null 
        // The Profile Picture will be stored on cloud the service name is Cloudinary
        public string? ProfilePicture { get; set; } = null;

        public DateTime UpdatedAt { get; set; } = DateTime.Now;
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        // Navigation Properties
        public virtual UserAdditionalInfo? UserAdditionalInfo { get; set; }
        public virtual ICollection<SpokenLanguage> SpokenLanguages { get; set; } = new List<SpokenLanguage>();
    }
}