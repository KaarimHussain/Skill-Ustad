namespace SkillUstad.Dto
{
    public class AddMentorAdditionalInfoDto
    {
        public MentorAdditionalInfoRequest Info { get; set; } = null!;
        public List<MentorInfoTagsRequest> Tags { get; set; } = null!;
    }

    public class MentorAdditionalInfoRequest
    {
        public Guid MentorId { get; set; }
        public string Bio { get; set; } = null!;
        public string LevelOfExpertise { get; set; } = null!;
        public string FieldOfExpertise { get; set; } = null!;
        public string IndustryExperience { get; set; } = null!;
        public string Gender { get; set; } = null!;
        public string City { get; set; } = null!;
        public string Address { get; set; } = null!;
    }

    public class MentorInfoTagsRequest
    {
        public string TagName { get; set; } = null!;
        public Guid MentorId { get; set; }
    }

}