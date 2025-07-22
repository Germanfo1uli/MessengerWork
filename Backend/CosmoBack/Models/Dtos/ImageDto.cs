namespace CosmoBack.Models.Dtos
{
    public class ImageDto
    {
        public Guid Id { get; set; }
        public string FileName { get; set; } = string.Empty;
        public string MimeType { get; set; } = string.Empty;
        public long FileSize { get; set; }
        public byte[] Data { get; set; } = Array.Empty<byte>();
        public string EntityType { get; set; } = string.Empty;
        public Guid EntityId { get; set; }
        public DateTime UploadDate { get; set; }
        public string? Url { get; set; }
    }
}