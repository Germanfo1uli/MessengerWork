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
        public string FileName { get; set; }

        [MaxLength(100)]
        public string MimeType { get; set; } 

        public long FileSize { get; set; }

        [Required]
        public byte[] Data { get; set; } 

        [MaxLength(50)]
        public string EntityType { get; set; }

        public Guid? EntityId { get; set; }

        public DateTime UploadDate { get; set; } = DateTime.UtcNow;

        [MaxLength(255)]
        public string? Url { get; set; } 
    }
}