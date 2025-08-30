using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SkillUstad.Data;
using SkillUstad.Dtos;
using SkillUstad.Models;

namespace SkillUstad.Controllers
{
    [ApiController]
    [Route("/api/company/additional-info")]
    public class CompaniesAdditionalInfoController(SkillUstadDbContext context, IConfiguration configuration) : ControllerBase
    {
        private readonly SkillUstadDbContext _context = context;
        private readonly IConfiguration _configuration = configuration;

        // POST: api/company/additional-info
        [HttpPost]
        public async Task<IActionResult> GetAdditionalInfo([FromQuery] int companyId)
        {
            var additionalInfo = await _context.CompaniesAdditionalInfo.FirstOrDefaultAsync(q => q.CompanyId == companyId);
            if (additionalInfo == null)
            {
                return NotFound(new { message = "Additional info not found" });
            }
            return Ok(additionalInfo);
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddAdditionalInfo([FromBody] CompanyAdditionalInfoAddRequest request)
        {
            // Validating Data
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Checking if the company exist
            var existCompany = await _context.Companies.FindAsync(request.CompanyId);
            if (existCompany == null) return NotFound(new { message = "Cannot find any Company with this ID" });

            var dataSet = new CompaniesAdditionalInfo
            {
                CompanyId = request.CompanyId,
                ContactPersonName = request.ContactPersonName,
                ContactPersonTitle = request.ContactPersonTitle,
                WorkPhone = request.WorkPhone,
                Industry = request.Industry,
                BusinessType = request.BusinessType,
                Country = request.Country,
                City = request.City,
                EmployeeCount = request.EmployeeCount,
                CompanyDescription = request.CompanyDescription,
                LinkedInUrl = request.LinkedInUrl,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _context.CompaniesAdditionalInfo.AddAsync(dataSet);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Successfully Added Additional Info" });
        }

        [HttpPost("info-check")]
        public async Task<IActionResult> CheckIfExist([FromBody] int companyId)
        {
            var exist = await _context.CompaniesAdditionalInfo.AnyAsync(q => q.CompanyId == companyId);
            return Ok(new { exists = exist });
        }
    }
}
