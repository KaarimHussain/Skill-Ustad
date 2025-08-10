using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SkillUstad.Data;
using SkillUstad.Dto;

namespace SkillUstad.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdditionalInfoController : ControllerBase
    {
        private readonly SkillUstadDbContext _context;
        public AdditionalInfoController(SkillUstadDbContext context) => _context = context;
        [HttpPost("/info-check")]
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
    }
}