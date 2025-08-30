using SkillUstad.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SkillUstad.Models
{
    [Table("CompaniesAdditionalInfo")]
    public class CompaniesAdditionalInfo
    {
        [Key, ForeignKey("Company")]
        public int CompanyId { get; set; }

        [StringLength(100)]
        public string? ContactPersonName { get; set; }

        [StringLength(100)]
        public string? ContactPersonTitle { get; set; }

        [Phone]
        [StringLength(20)]
        public string? WorkPhone { get; set; }

        [StringLength(100)]
        public string? Industry { get; set; }

        [StringLength(50)]
        public string? BusinessType { get; set; }

        [StringLength(100)]
        public string? Country { get; set; }

        [StringLength(100)]
        public string? City { get; set; }

        public int? EmployeeCount { get; set; }

        [StringLength(500)]
        public string? CompanyDescription { get; set; }

        [Url]
        [StringLength(255)]
        public string? LinkedInUrl { get; set; }

        // Timestamps
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        // Navigation Properties
        public Company Company { get; set; } = null!;
    }
}
