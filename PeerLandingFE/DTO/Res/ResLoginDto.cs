namespace PeerLandingFE.DTO.Res
{
    public class ResLoginDto
    {
        public class LoginResponse
        {
            public bool Success { get; set; }
            public string Message { get; set; }
            public UserData Data { get; set; }

        }

        public class UserData
        {
            public string token { get; set; }
        }
    }
}
