namespace SkillUstad.Dto
{
    public class GoogleLoginRequest
    {
        public string IdToken { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Name { get; set; } = null!;
        public string Picture { get; set; } = null!;
    }
}
