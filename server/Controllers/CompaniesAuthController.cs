using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using SkillUstad.Data;
using SkillUstad.Dto;
using SkillUstad.Dtos;
using SkillUstad.Models;
using SkillUstad.Service;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Xml.Linq;

namespace SkillUstad.Controller{

    [ApiController]
    [Route("/api/company/auth")]
    public class CompanyAuth(SkillUstadDbContext context, EmailService emailService, IConfiguration configuration) : ControllerBase
    {
        private readonly SkillUstadDbContext _context = context;
        private readonly EmailService _emailService = emailService;
        private readonly IConfiguration _configuration = configuration;

        // POST: api/company/CompaniesAuth/register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] CompaniesRegisterRequest request)
        {
            Console.WriteLine("Request Data" + request.Website);
            Console.WriteLine("Request Data" + request.Password);
            Console.WriteLine("Request Data" + request.CompanyEmail);
            Console.WriteLine("Request Data" + request.CompanyName);

            if (!ValidateCompanyData(request))
            {
                return BadRequest(new { message = "Invalid company data" });
            }
            try
            {
                // Save in the database
                var company = new Company
                {
                    CompanyName = request.CompanyName,
                    WorkEmail = request.CompanyEmail,
                    Website = request.Website,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                    IsEmailVerified = false,
                    IsDomainVerified = false,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                // Save in the database
                await _context.Companies.AddAsync(company);
                await _context.SaveChangesAsync();
                // Send professional registration email to company
                await _emailService.SendCompanyRegistrationEmail(
                    request.CompanyEmail,
                    request.CompanyName,
                    request.Website ?? "https://skillustad.com"
                );

                return Ok(new { message = "Company registration successful, your account will be verified by our team" });
            }
            catch (Exception error)
            {
                return StatusCode(500, new { message = "An error occurred while processing your request.", error = error.Message });
            }
        }

        // POST: api/company/CompaniesAuth/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] CompaniesLoginRequest request)
        {
            if (!ValidateCompanyLoginData(request)) return BadRequest(new { message = "Invalid company data" });
            // Validate Admin
            if (isAdmin(request))
            {
                var RandomId = Guid.NewGuid();
                var adminConfig = _configuration.GetSection("Admin");
                var Token = GenerateJwtToken(RandomId.ToString(), adminConfig["Email"]!, "Admin-SkillUstad", "Admin");
                // Variables
                var Name = "Admin-SkillUstad";
                var Email = adminConfig["Email"];
                var UserType = "Admin";
                var ProfilePicture = "";

                return Ok(new
                {
                    Message = "Admin Login successful",
                    UserType,
                    Token,
                    User = new
                    {
                        RandomId,
                        Name,
                        Email,
                        ProfilePicture
                    }
                });
            }
            // Find Company Data and check if it's registered
            var company = await _context.Companies.FirstOrDefaultAsync(q => q.WorkEmail == request.CompanyEmail);
            if (company == null) return NotFound(new { message = "Your Company is not Registered!" });

            // If it's registered then check if it's verified

            if(!company.IsEmailVerified || !company.IsDomainVerified)
            {
                return BadRequest(new { message = "Your Company is not verified yet! Try again later." });
            }

            // Company is verified - create an JWT token and pass it to the frontend
            var token = GenerateJwtToken(company.Id.ToString(), company.WorkEmail, company.CompanyName, "Company");

            // Variables
            var CompanyId = company.Id;
            var CompanyName = company.CompanyName;
            var CompanyEmail = company.WorkEmail;
            var CompanyPicture = "";
             
            return Ok(new
            {
                Message = "Login successful",
                UserType = "Company",
                Token = token,
                User = new
                {
                    CompanyId,
                    CompanyName,
                    CompanyEmail,
                    CompanyPicture
                }
            });
        }

        private bool isAdmin(CompaniesLoginRequest request)
        {
            var adminConfig = _configuration.GetSection("Admin");
            if(adminConfig == null) return false;
            if (adminConfig["email"] == request.CompanyEmail && adminConfig["password"] == request.Password) return true;
            return false;
        }

        private bool ValidateCompanyLoginData(CompaniesLoginRequest request)
        {
            if (request == null) return false;
            if (request.CompanyEmail == null || !request.CompanyEmail.Contains("@")) return false;
            if (request.Password.Length < 6) return false;
            if(string.IsNullOrWhiteSpace(request.CompanyEmail)) return false;
            return true;
        }

        private bool ValidateCompanyData(CompaniesRegisterRequest request)
        {
            // Check if the request body is null
            if (request == null)
            {
                return false;
            }
            // Basic validation
            if (request.CompanyEmail == null || !request.CompanyEmail.Contains("@"))
            {
                return false;
            }
            if (string.IsNullOrWhiteSpace(request.CompanyName))
            {
                return false;
            }
            if (string.IsNullOrWhiteSpace(request.Password) || request.Password.Length < 6)
            {
                return false;
            }

            return true;
        }

        // JWT Token Generation Method
        private string GenerateJwtToken(string userId, string email, string name, string userType)
        {
            var jwtConfig = _configuration.GetSection("Jwt");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtConfig["Key"]));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, userId),
                new Claim(JwtRegisteredClaimNames.Email, email),
                new Claim(JwtRegisteredClaimNames.Name, name),
                new Claim("UserType", userType),
                new Claim("UserId", userId),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.Iat,
                    new DateTimeOffset(DateTime.UtcNow).ToUnixTimeSeconds().ToString(),
                    ClaimValueTypes.Integer64)
            };

            var token = new JwtSecurityToken(
                issuer: jwtConfig["Issuer"],
                audience: jwtConfig["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(60), // Token expires in 1 Hours
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}