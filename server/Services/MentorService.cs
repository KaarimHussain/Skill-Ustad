using Microsoft.EntityFrameworkCore;
using SkillUstad.Data;
using SkillUstad.Dto;

namespace SkillUstad.Services
{
    public class MentorService : IMentorService
    {
        private readonly SkillUstadDbContext _context;

        public MentorService(SkillUstadDbContext context)
        {
            _context = context;
        }

        public async Task<List<MentorPublicDto>> GetAllMentorsAsync()
        {
            return await _context.Mentors
                .Include(m => m.MentorAdditionalInfo)
                .Include(m => m.ExpertiseTags)
                .Include(m => m.SpokenLanguages)
                .Select(m => new MentorPublicDto
                {
                    Id = m.Id,
                    Name = m.Name,
                    Email = m.Email,
                    ProfilePicture = m.ProfilePicture,
                    CreatedAt = m.CreatedAt,
                    Bio = m.MentorAdditionalInfo != null ? m.MentorAdditionalInfo.Bio : null,
                    LevelOfExpertise = m.MentorAdditionalInfo != null ? m.MentorAdditionalInfo.LevelOfExpertise : null,
                    FieldOfExpertise = m.MentorAdditionalInfo != null ? m.MentorAdditionalInfo.FieldOfExpertise : null,
                    IndustryExperience = m.MentorAdditionalInfo != null ? m.MentorAdditionalInfo.IndustryExperience : null,
                    Gender = m.MentorAdditionalInfo != null ? m.MentorAdditionalInfo.Gender : null,
                    City = m.MentorAdditionalInfo != null ? m.MentorAdditionalInfo.City : null,
                    ExpertiseTags = m.ExpertiseTags.Select(et => et.TagName).ToList(), // Assuming 'Tag' property exists
                    SpokenLanguages = m.SpokenLanguages.Select(sl => sl.Language).ToList() // Assuming 'Language' property exists
                })
                .ToListAsync();
        }

        public async Task<MentorPublicDto?> GetMentorByIdAsync(Guid id)
        {
            return await _context.Mentors
                .Include(m => m.MentorAdditionalInfo)
                .Include(m => m.ExpertiseTags)
                .Include(m => m.SpokenLanguages)
                .Where(m => m.Id == id)
                .Select(m => new MentorPublicDto
                {
                    Id = m.Id,
                    Name = m.Name,
                    Email = m.Email,
                    ProfilePicture = m.ProfilePicture,
                    CreatedAt = m.CreatedAt,
                    Bio = m.MentorAdditionalInfo != null ? m.MentorAdditionalInfo.Bio : null,
                    LevelOfExpertise = m.MentorAdditionalInfo != null ? m.MentorAdditionalInfo.LevelOfExpertise : null,
                    FieldOfExpertise = m.MentorAdditionalInfo != null ? m.MentorAdditionalInfo.FieldOfExpertise : null,
                    IndustryExperience = m.MentorAdditionalInfo != null ? m.MentorAdditionalInfo.IndustryExperience : null,
                    Gender = m.MentorAdditionalInfo != null ? m.MentorAdditionalInfo.Gender : null,
                    City = m.MentorAdditionalInfo != null ? m.MentorAdditionalInfo.City : null,
                    ExpertiseTags = m.ExpertiseTags.Select(et => et.TagName).ToList(),
                    SpokenLanguages = m.SpokenLanguages.Select(sl => sl.Language).ToList()
                })
                .FirstOrDefaultAsync();
        }
    }

    public interface IMentorService
    {
        Task<List<MentorPublicDto>> GetAllMentorsAsync();
        Task<MentorPublicDto?> GetMentorByIdAsync(Guid id);
    }
}
