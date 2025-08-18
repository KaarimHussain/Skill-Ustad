export default interface RegisterRequest {
    Name: string;
    Email: string;
    Password: string;
    OAuthProvider: string;
    OAuthId: string;
    ProfilePicture: string;
    UserType: string; // "Student" or "Mentor"
}