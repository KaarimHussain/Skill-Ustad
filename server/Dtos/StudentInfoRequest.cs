namespace SkillUstad.Dto
{
    public class AddStudentAdditionalInfoDto
    {
        public StudentAdditionalInfoRequest Info { get; set; } = null!;
    }

    public class StudentAdditionalInfoRequest
    {
        public Guid UserId { get; set; }
        public string CurrentLevelOfEducation { get; set; } = null!;
        public string LevelOfExpertise { get; set; } = null!;
        public string FieldOfExpertise { get; set; } = null!;
        public string UserInterestsAndGoals { get; set; } = null!;
        public string Gender { get; set; } = null!;
        public string City { get; set; } = null!;
        public string Address { get; set; } = null!;
    }
}