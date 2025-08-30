using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SkillUstad.Dtos;
using SkillUstad.Data;
using SkillUstad.Service;

namespace SkillUstad.Controllers
{
    [ApiController]
    [Route("/api/request")]
    public class CompaniesRequestController(SkillUstadDbContext context, EmailService emailService) : ControllerBase
    {
        private readonly SkillUstadDbContext _context = context;
        private readonly EmailService _emailService = emailService;

        [HttpGet]
        public async Task<IActionResult> GetAllRequest()
        {
            var request = await _context.Companies
            .Where(q => !q.IsDomainVerified && !q.IsEmailVerified)
            .Select(q => new CompanyPendingRequestDto
            {
                Id = q.Id,
                CompanyName = q.CompanyName,
                WorkEmail = q.WorkEmail,
                Website = q.Website,
                CreatedAt = q.CreatedAt
            })
            .ToListAsync();

            return Ok(request);
        }

        [HttpPost("approve")]
        public async Task<IActionResult> ApprovedRequest([FromBody] CompanyActionDto request)
        {
            var company = await _context.Companies.FirstOrDefaultAsync(q => q.Id == request.Id);
            if (company == null) return NotFound(new { message = "Cannot find the Company Data!" });

            company.IsDomainVerified = true;
            company.IsEmailVerified = true;

            await _context.SaveChangesAsync();
            await _emailService.SendCompanyApprovedEmail(company.WorkEmail, company.CompanyName, company.Website);

            return Ok(new { message = "Company Approved!" });
        }

        [HttpPost("reject")]
        public async Task<IActionResult> RejectRequest([FromBody] CompanyActionDto request)
        {
            var company = await _context.Companies.FirstOrDefaultAsync(q => q.Id == request.Id);
            if (company == null) return NotFound(new { message = "Cannot find the Company Data!" });

            company.IsDomainVerified = false;
            company.IsEmailVerified = false;

            await _context.SaveChangesAsync();
            await _emailService.SendCompanyRejectEmail(company.WorkEmail, company.CompanyName, company.Website);

            return Ok(new { message = "Company Rejected!" });
        }

    }

    // Basic DTO for passing Id to the Requests method
    public class CompanyActionDto
    {
        public int Id { get; set; }
    }
}
