namespace CosmoBack.Models.Dtos
{
    public class ContactDto
    {
        public Guid Id { get; set; }
        public Guid OwnerId { get; set; }
        public Guid ContactId { get; set; }
        public string? ContactUsername { get; set; }
        public string? ContactPhone { get; set; }
        public string? Tag { get; set; }
    }
}