using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SkillUstad.Models
{
    [Table("Companies")]
    public class Company
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(200)]
        public string CompanyName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [StringLength(255)]
        public string WorkEmail { get; set; } = string.Empty;

        [Required]
        [StringLength(255)]
        public string Website { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        // Verification Status
        public bool IsEmailVerified { get; set; } = false;
        public bool IsDomainVerified { get; set; } = false;

        // Timestamps
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Property for One-to-One relationship with CompaniesAdditionalInfo
        public CompaniesAdditionalInfo? CompaniesAdditionalInfo { get; set; }
    }
}
