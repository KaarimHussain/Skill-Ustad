using Microsoft.EntityFrameworkCore;
using SkillUstad.Data;
using SkillUstad.Dto;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SkillUstad.Services
{
    public class CompanyService : ICompanyService
    {
        private readonly SkillUstadDbContext _context;

        public CompanyService(SkillUstadDbContext context)
        {
            _context = context;
        }

        public async Task<List<CompanyPublicDto>> GetAllCompanyAsync()
        {
            return await _context.Companies
                .Include(c => c.CompaniesAdditionalInfo)
                .Select(c => new CompanyPublicDto
                {
                    Id = c.Id,
                    CompanyName = c.CompanyName,
                    WorkEmail = c.WorkEmail,
                    Website = c.Website,
                    ContactPersonName = c.CompaniesAdditionalInfo != null ? c.CompaniesAdditionalInfo.ContactPersonName : null,
                    ContactPersonTitle = c.CompaniesAdditionalInfo != null ? c.CompaniesAdditionalInfo.ContactPersonTitle : null,
                    WorkPhone = c.CompaniesAdditionalInfo != null ? c.CompaniesAdditionalInfo.WorkPhone : null,
                    Industry = c.CompaniesAdditionalInfo != null ? c.CompaniesAdditionalInfo.Industry : null,
                    BusinessType = c.CompaniesAdditionalInfo != null ? c.CompaniesAdditionalInfo.BusinessType : null,
                    Country = c.CompaniesAdditionalInfo != null ? c.CompaniesAdditionalInfo.Country : null,
                    City = c.CompaniesAdditionalInfo != null ? c.CompaniesAdditionalInfo.City : null,
                    EmployeeCount = c.CompaniesAdditionalInfo != null ? c.CompaniesAdditionalInfo.EmployeeCount : null,
                    CompanyDescription = c.CompaniesAdditionalInfo != null ? c.CompaniesAdditionalInfo.CompanyDescription : null,
                    LinkedInUrl = c.CompaniesAdditionalInfo != null ? c.CompaniesAdditionalInfo.LinkedInUrl : null,
                    CreatedAt = c.CreatedAt
                })
                .ToListAsync();
        }

        public async Task<CompanyPublicDto?> GetCompanyByIdAsync(int id)
        {
            return await _context.Companies
                .Include(c => c.CompaniesAdditionalInfo)
                .Where(c => c.Id == id)
                .Select(c => new CompanyPublicDto
                {
                    Id = c.Id,
                    CompanyName = c.CompanyName,
                    WorkEmail = c.WorkEmail,
                    Website = c.Website,
                    ContactPersonName = c.CompaniesAdditionalInfo != null ? c.CompaniesAdditionalInfo.ContactPersonName : null,
                    ContactPersonTitle = c.CompaniesAdditionalInfo != null ? c.CompaniesAdditionalInfo.ContactPersonTitle : null,
                    WorkPhone = c.CompaniesAdditionalInfo != null ? c.CompaniesAdditionalInfo.WorkPhone : null,
                    Industry = c.CompaniesAdditionalInfo != null ? c.CompaniesAdditionalInfo.Industry : null,
                    BusinessType = c.CompaniesAdditionalInfo != null ? c.CompaniesAdditionalInfo.BusinessType : null,
                    Country = c.CompaniesAdditionalInfo != null ? c.CompaniesAdditionalInfo.Country : null,
                    City = c.CompaniesAdditionalInfo != null ? c.CompaniesAdditionalInfo.City : null,
                    EmployeeCount = c.CompaniesAdditionalInfo != null ? c.CompaniesAdditionalInfo.EmployeeCount : null,
                    CompanyDescription = c.CompaniesAdditionalInfo != null ? c.CompaniesAdditionalInfo.CompanyDescription : null,
                    LinkedInUrl = c.CompaniesAdditionalInfo != null ? c.CompaniesAdditionalInfo.LinkedInUrl : null,
                    CreatedAt = c.CreatedAt
                })
                .FirstOrDefaultAsync();
        }
    }

    public interface ICompanyService
    {
        Task<List<CompanyPublicDto>> GetAllCompanyAsync();
        Task<CompanyPublicDto?> GetCompanyByIdAsync(int id);
    }
}
