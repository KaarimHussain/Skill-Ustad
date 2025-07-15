using Microsoft.EntityFrameworkCore;

namespace SkillUstad.Data
{
    public class SkillUstadDbContext : DbContext
    {
        public SkillUstadDbContext(DbContextOptions<SkillUstadDbContext> options) : base(options) { }
    }
}