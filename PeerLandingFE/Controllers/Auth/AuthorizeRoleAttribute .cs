using Microsoft.AspNetCore.Authorization;
using System.Data;

namespace PeerLandingFE.Controllers.Auth
{
    public class AuthorizeRoleAttribute : AuthorizeAttribute
    {
        public AuthorizeRoleAttribute(params string[] roles)
        {
            Roles = string.Join(",", roles);
        }
    }
}
