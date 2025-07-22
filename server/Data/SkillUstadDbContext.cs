using Microsoft.EntityFrameworkCore;
using SkillUstad.Models;

namespace SkillUstad.Data
{
    public class SkillUstadDbContext : DbContext
    {
        public SkillUstadDbContext(DbContextOptions<SkillUstadDbContext> options) : base(options) { }

        public DbSet<Users> Users { get; set; }
        public DbSet<Mentor> Mentors { get; set; }
        public DbSet<UserAdditionalInfo> UserAdditionalInfos { get; set; }
        public DbSet<MentorAdditionalInfo> MentorAdditionalInfos { get; set; }
        public DbSet<MentorExpertiseTag> MentorExpertiseTags { get; set; }
        public DbSet<SpokenLanguage> SpokenLanguages { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure Users and UserAdditionalInfo (One-to-One)
            modelBuilder.Entity<Users>()
                .HasOne(u => u.UserAdditionalInfo)
                .WithOne(ua => ua.User)
                .HasForeignKey<UserAdditionalInfo>(ua => ua.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure Mentor and MentorAdditionalInfo (One-to-One)
            modelBuilder.Entity<Mentor>()
                .HasOne(m => m.MentorAdditionalInfo)
                .WithOne(ma => ma.Mentor)
                .HasForeignKey<MentorAdditionalInfo>(ma => ma.MentorId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure Mentor and MentorExpertiseTag (One-to-Many)
            modelBuilder.Entity<Mentor>()
                .HasMany(m => m.ExpertiseTags)
                .WithOne(met => met.Mentor)
                .HasForeignKey(met => met.MentorId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure SpokenLanguage relationships
            // This is a bit complex because SpokenLanguage can reference both Users and Mentors
            // Option 1: Use a discriminator approach (recommended)
            modelBuilder.Entity<SpokenLanguage>()
                .HasOne(sl => sl.User)
                .WithMany(u => u.SpokenLanguages)
                .HasForeignKey(sl => sl.UserId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_SpokenLanguage_Users");

            modelBuilder.Entity<SpokenLanguage>()
                .HasOne(sl => sl.Mentor)
                .WithMany(m => m.SpokenLanguages)
                .HasForeignKey(sl => sl.UserId)
                .OnDelete(DeleteBehavior.NoAction) // Prevent multiple cascade paths
                .HasConstraintName("FK_SpokenLanguage_Mentors");

            // Add indexes for better performance
            modelBuilder.Entity<Users>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<Mentor>()
                .HasIndex(m => m.Email)
                .IsUnique();

            modelBuilder.Entity<SpokenLanguage>()
                .HasIndex(sl => new { sl.UserId, sl.UserType });

            // Configure UserType as required
            modelBuilder.Entity<SpokenLanguage>()
                .Property(sl => sl.UserType)
                .HasMaxLength(10)
                .IsRequired();

            // Set string length constraints
            modelBuilder.Entity<Users>()
                .Property(u => u.Name)
                .HasMaxLength(100);

            modelBuilder.Entity<Mentor>()
                .Property(m => m.Name)
                .HasMaxLength(100);

            modelBuilder.Entity<MentorExpertiseTag>()
                .Property(met => met.TagName)
                .HasMaxLength(50);

            modelBuilder.Entity<SpokenLanguage>()
                .Property(sl => sl.Language)
                .HasMaxLength(50);
        }

    }
}