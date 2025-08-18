export interface MentorAdditionalInfoRequest {
    MentorId: string;
    Bio: string;
    LevelOfExpertise: string;
    FieldOfExpertise: string;
    IndustryExperience: string;
    Gender: string;
    City: string;
    Address: string;
}

export interface MentorInfoTagsRequest {
    TagName: string;
    MentorId: string;
}
