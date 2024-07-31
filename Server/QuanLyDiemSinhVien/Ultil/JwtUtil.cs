using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Web;

namespace asd123.Ultil
{
    public static class JwtUtil
    {
        public static string GenerateAccessToken(int userId, byte[] secretKey)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] { new Claim("id", userId.ToString()) }),
                Expires = DateTime.UtcNow.AddDays(5),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(secretKey), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }


        public static string GenerateRefreshToken()
        {
            var randomNumber = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }

        public static string MD5Hash(string input)
        {
            StringBuilder hash = new();
            MD5CryptoServiceProvider md5provider = new();
            byte[] bytes = md5provider.ComputeHash(new UTF8Encoding().GetBytes(input));

            for (int i = 0; i < bytes.Length; i++)
            {
                hash.Append(bytes[i].ToString("x2"));
            }
            return hash.ToString();
        }


        public static int GetRefreshTokenExpiryTime()
        {
            var refreshTokenExpiryDate = DateTime.Now.AddDays(7);
            return DateTimeToUnixTimeStamp(refreshTokenExpiryDate);
        }

        public static int DateTimeToUnixTimeStamp(DateTime dateTime)
        {
            DateTime localDateTime = TimeZoneInfo.ConvertTimeBySystemTimeZoneId(dateTime, TimeUtil.TIMEZONE_ID.GMT0);
            int unixTimestamp = (int)(localDateTime - new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc)).TotalSeconds;
            return unixTimestamp;
        }

        public static string Encode(string url)
        {
            return HttpUtility.UrlEncode(url);
        }

        public static string Decode(string url)
        {
            return HttpUtility.UrlDecode(url);
        }

        public static bool Compare(string password, string userPassword)
        {
            string hash = MD5Hash(password);
            return hash.ToLower().Equals(userPassword.ToLower());
        }

    }
}
