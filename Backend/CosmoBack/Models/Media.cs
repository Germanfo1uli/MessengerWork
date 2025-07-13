using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CosmoBack.Models
{
    public class Media
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [ForeignKey("Message")]
        public Guid MessageId { get; set; }

        [MaxLength(255)]
        public string? FileUrl { get; set; }

        [Required]
        [MaxLength(20)]
        public MediaType Type { get; set; }

        [Required]
        [Column(TypeName = "bytea")]
        public byte[] FileSize { get; set; } = default!;

        [MaxLength(100)]
        public string? MimeType { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Навигационные свойства
        public virtual Message Message { get; set; }
    }

    public enum MediaType
    {
        Photo,
        Video,
        Document,
        Audio
    }
}