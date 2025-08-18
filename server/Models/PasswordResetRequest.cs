using System.ComponentModel.DataAnnotations;

namespace SkillUstad.Models
{
    public class PasswordResetRequest
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid UserId { get; set; }

        [Required]
        public string Token { get; set; } = null!;

        [Required]
        public DateTime ExpiresAt { get; set; }

        [Required]
        public bool IsUsed { get; set; } = false;

        // Navigation Property
        public virtual Users User { get; set; }
    }
}
