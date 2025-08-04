using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SkillUstad.Models
{
    public class OtpRequest
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string? OTP { get; set; }
        public bool IsVerified { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime ExpiresAt { get; set; }
        // Foreign Key
        [Required]
        public string? UserId { get; set; }
        [ForeignKey("UserId")]
        public Users? User { get; set; }  // If you're using Identity
    }
}