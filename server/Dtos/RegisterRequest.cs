namespace SkillUstad.Dto
{
    public class RegisterRequest
    {
        public string Name { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string? Password { get; set; } = null;
        public string? OAuthProvider { get; set; } = null;
        public string? OAuthId { get; set; } = null;
        public string? ProfilePicture { get; set; } = null;
        public string? UserType { get; set; } = null; // "Student" or "Mentor"
    }
}