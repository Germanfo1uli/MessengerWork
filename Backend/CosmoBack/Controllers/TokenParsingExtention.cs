using System.Security.Claims;

namespace CosmoBack.Controllers
{
    public static class ClaimsPrincipalExtensions
    {
        public static Guid GetUserId(this ClaimsPrincipal principal)
        {
            var claim = principal.FindFirst(c =>
                c.Type == "sub" ||
                c.Type == ClaimTypes.NameIdentifier)
                ?? throw new UnauthorizedAccessException("User ID claim not found");

            if (!Guid.TryParse(claim.Value, out var userId))
                throw new UnauthorizedAccessException("Invalid user ID format");

            return userId;
        }
    }
}