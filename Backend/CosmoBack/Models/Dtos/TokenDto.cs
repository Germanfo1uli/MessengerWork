namespace CosmoBack.Models.Dtos
{
    public class TokenDto
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string Name { get; set; } = default!;
        public string ClientId { get; set; } = default!;
        public string ClientSecret { get; set; } = default!;
        public string TokenValue { get; set; } = default!;
        public string AuthorizationEndpoint { get; set; } = default!;
        public string TokenEndpoint { get; set; } = default!;
        public string? UserInfoEndpoint { get; set; }
    }
}