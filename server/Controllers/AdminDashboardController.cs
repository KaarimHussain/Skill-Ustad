using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SkillUstad.Data;

namespace SkillUstad.Controllers
{
    [Route("api/admin-dashboard")]
    [ApiController]
    public class AdminDashboardController(SkillUstadDbContext context) : ControllerBase
    {
        private readonly SkillUstadDbContext _context = context;

        [HttpGet("stats")]
        public async Task<IActionResult> GetDashboardStats()
        {
            var totalUsers = await _context.Users.CountAsync();
            var totalMentor = await _context.Mentors.CountAsync();
            var totalCompanies = await _context.Companies.CountAsync();
            var totalPendingCompany = await _context.Companies.CountAsync(q => !q.IsDomainVerified && !q.IsEmailVerified);
            var stats = new
            {
                TotalStudents = totalUsers,
                TotalMentor = totalMentor,
                TotalCompanies = totalCompanies,
                companiesPendingRequest = totalPendingCompany
            };
            return Ok(stats);
        }
        [HttpGet("system-metrics")]
        public IActionResult GetSystemMetrics()
        {
            // Pseudocode:
            // 1. Get CPU usage (mocked as 68)
            // 2. Get Memory usage (mocked as 45)
            // 3. Get Storage usage (mocked as 72)
            // 4. Get Network usage (mocked as 34)
            // 5. Return as array of objects with metric, value, color

            var systemMetrics = new[]
            {
                new { metric = "CPU Usage", value = 68, color = "#ef4444" },
                new { metric = "Memory", value = 45, color = "#3b82f6" },
                new { metric = "Storage", value = 72, color = "#f59e0b" },
                new { metric = "Network", value = 34, color = "#10b981" }
            };

            return Ok(systemMetrics);
        }

    }
}
