using System.ComponentModel.DataAnnotations;

namespace SkillUstad.Models
{
    public class UserVerification
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid AccountId { get; set; }

        public bool IsEmailVerified { get; set; } = false;

        public DateTime? VerifiedAt { get; set; }

        [Required]
        public string AccountType { get; set; } // "User" or "Mentor"

    }
}
