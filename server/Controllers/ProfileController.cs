using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SkillUstad.Data;
using SkillUstad.Dtos;

namespace SkillUstad.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProfileController(SkillUstadDbContext context) : ControllerBase
    {
        private readonly SkillUstadDbContext _context = context;

        [HttpGet("test")]
        public ActionResult Test()
        {
            return Ok("Profile Controller is working!");
        }

        [HttpPost("student")]
        public async Task<ActionResult> GetStudentData([FromBody] StudentProfileRequest request)
        {
            if (request == null) return BadRequest("Invalid request");

            var student = await _context.Users
                .Where(q => q.Id == request.StudentId)
                .Select(q => new
                {
                    q.Id,
                    q.Name,
                    q.Email,
                    q.ProfilePicture,
                    q.UserAdditionalInfo.CurrentLevelOfEducation,
                    q.UserAdditionalInfo.LevelOfExpertise,
                    q.UserAdditionalInfo.FieldOfExpertise,
                    q.UserAdditionalInfo.UserInterestsAndGoals,
                    q.UserAdditionalInfo.City,
                    q.UserAdditionalInfo.Address,
                    q.UserAdditionalInfo.Gender
                })
                .FirstOrDefaultAsync();

            if (student == null) return NotFound();

            return Ok(student);
        }

        [HttpPost("mentor")]
        public async Task<ActionResult> GetMentorData([FromBody] MentorProfileRequest request)
        {
            if (request == null) return BadRequest("Invalid request");
            var mentor = await _context.Mentors.Include(q => q.MentorAdditionalInfo).FirstOrDefaultAsync(q => q.Id == request.MentorId);
            if (mentor == null)
            {
                return NotFound();
            }
            return Ok(mentor);
        }
    }
}