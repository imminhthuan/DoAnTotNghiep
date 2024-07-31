namespace asd123.Model
{
    public class LoginResponse
    {
        public bool IsLoggedIn { get; set; } = false;
        public RefreshToken? RefreshToken { get; set; }
        public MyTokenModel? MyJwtToken { get; set; }
    }
}
