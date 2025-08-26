using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SkillUstad.Data;
using SkillUstad.Dto;
using SkillUstad.Models;

namespace SkillUstad.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdditionalInfoController(SkillUstadDbContext context) : ControllerBase
    {
        private readonly SkillUstadDbContext _context = context;

        [HttpPost("info-check")]
        public async Task<ActionResult> CheckIfUserHasAddtionalInfo([FromBody] CheckAdditionalInfoRequest request)
        {
            var hasAdditionalInfo = request.Role.ToLower() == "mentor"
                ? await _context.MentorAdditionalInfos
                    .Include(q => q.Mentor)
                    .AnyAsync(q => q.Mentor.Email == request.Email)
                : await _context.UserAdditionalInfos
                    .Include(q => q.User)
                    .AnyAsync(q => q.User.Email == request.Email);

            return Ok(hasAdditionalInfo);
        }

        [HttpPost("mentor-info")]
        public async Task<ActionResult> AddMentorAdditionalInfo([FromBody] AddMentorAdditionalInfoDto request)
        {
            if (request == null || request.Info == null || request.Tags == null)
                return BadRequest("Invalid request data.");

            // Save Mentor Info
            var mentorInfoEntity = new MentorAdditionalInfo
            {
                MentorId = request.Info.MentorId,
                Bio = request.Info.Bio,
                LevelOfExpertise = request.Info.LevelOfExpertise,
                FieldOfExpertise = request.Info.FieldOfExpertise,
                IndustryExperience = request.Info.IndustryExperience,
                Gender = request.Info.Gender,
                City = request.Info.City,
                Address = request.Info.Address
            };
            _context.MentorAdditionalInfos.Add(mentorInfoEntity);

            // Save Tags
            foreach (var tag in request.Tags)
            {
                var tagEntity = new MentorExpertiseTag
                {
                    TagName = tag.TagName,
                    MentorId = tag.MentorId
                };
                _context.MentorExpertiseTags.Add(tagEntity);
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Mentor additional info and tags saved successfully." });
        }

        [HttpPost("student-info")]
        public async Task<ActionResult> AddUserAdditionalInfo([FromBody] AddStudentAdditionalInfoDto request)
        {
            if (request == null || request.Info == null)
                return BadRequest("Invalid request data.");

            // Save User Info
            var userInfoEntity = new UserAdditionalInfo
            {
                UserId = request.Info.UserId,
                CurrentLevelOfEducation = request.Info.CurrentLevelOfEducation,
                LevelOfExpertise = request.Info.LevelOfExpertise,
                FieldOfExpertise = request.Info.FieldOfExpertise,
                UserInterestsAndGoals = request.Info.UserInterestsAndGoals,
                Gender = request.Info.Gender,
                City = request.Info.City,
                Address = request.Info.Address
            };
            _context.UserAdditionalInfos.Add(userInfoEntity);

            await _context.SaveChangesAsync();
            return Ok(new { message = "User additional info saved successfully." });
        }

        [HttpPost("get-info")]
        public async Task<ActionResult> GetMentorAdditionalInfo([FromBody] string mentorId)
        {
            var mentor = await _context.MentorAdditionalInfos.FirstOrDefaultAsync(q => q.MentorId.ToString() == mentorId);

            if (mentor != null)
            {
                var mentorInfoReturn = new MentorAdditionalInfoRequest
                {
                    MentorId = mentor.MentorId,
                    Bio = mentor.Bio ?? string.Empty,
                    LevelOfExpertise = mentor.LevelOfExpertise ?? string.Empty,
                    FieldOfExpertise = mentor.FieldOfExpertise ?? string.Empty,
                    IndustryExperience = mentor.IndustryExperience ?? string.Empty,
                    Gender = mentor.Gender ?? string.Empty,
                    City = mentor.City ?? string.Empty,
                    Address = mentor.Address ?? string.Empty
                };

                return Ok(mentorInfoReturn);
            }
            else
            {
                return NotFound("Mentor Information doesn't exist");
            }
        }
    }
}