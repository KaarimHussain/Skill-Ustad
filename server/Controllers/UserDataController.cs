using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SkillUstad.Data;
using SkillUstad.Services;

namespace SkillUstad.Controllers
{
    [Route("api/user-data")]
    [ApiController]
    public class UserDataController : ControllerBase
    {
        private readonly IMentorService _mentorService;
        private readonly ICompanyService _companyService;
        private readonly SkillUstadDbContext _context;

        public UserDataController(IMentorService mentorService, ICompanyService companyService, SkillUstadDbContext context)
        {
            _mentorService = mentorService;
            _companyService = companyService;
            _context = context;
        }

        [HttpGet("mentor")]
        public async Task<IActionResult> GetAllMentor()
        {
            var mentors = await _mentorService.GetAllMentorsAsync();
            return Ok(mentors);
        }

        [HttpGet("mentor/{id}")]
        public async Task<IActionResult> GetMentorById(Guid id)
        {
            var mentor = await _mentorService.GetMentorByIdAsync(id);
            if (mentor == null)
            {
                return NotFound();
            }
            return Ok(mentor);
        }

        [HttpGet("company")]
        public async Task<IActionResult> GetAllCompany()
        {
            var companies = await _companyService.GetAllCompanyAsync();
            return Ok(companies);
        }

        [HttpGet("company/{id}")]
        public async Task<IActionResult> GetCompanyById(int id)
        {
            var company = await _companyService.GetCompanyByIdAsync(id);
            if (company == null)
            {
                return NotFound();
            }
            return Ok(company);
        }
    }
}