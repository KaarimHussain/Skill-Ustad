using System.ComponentModel.DataAnnotations;

namespace SkillUstad.Models
{
    public class EmailOtp
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid AccountId { get; set; } // Can be user OR mentor

        [Required]
        [MaxLength(10)]
        public string UserType { get; set; } // "User" or "Mentor"

        [Required]
        public string OtpCode { get; set; }

        [Required]
        public DateTime ExpiresAt { get; set; }

        public bool IsUsed { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
