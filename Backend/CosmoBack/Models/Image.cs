using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CosmoBack.Models
{
    public class Image
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(255)]
        public string FileName { get; set; } = default!;

        [Required]
        [MaxLength(100)]
        public string MimeType { get; set; } = default!;

        public long FileSize { get; set; }

        [Required]
        [Column(TypeName = "bytea")]
        public byte[] Data { get; set; } = default!;

        [Required]
        [MaxLength(50)]
        public string EntityType { get; set; }

        [Required]
        public Guid EntityId { get; set; }

        [Required]
        public DateTime UploadDate { get; set; } = DateTime.UtcNow;

        [MaxLength(255)]
        public string? Url { get; set; } 
    }
}