using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CosmoBack.Models
{
    public class Contact
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [ForeignKey("Owner")]
        public Guid OwnerId { get; set; }

        [Required]
        [ForeignKey("ContactUser")]
        public Guid ContactId { get; set; }

        [MaxLength(100)]
        public string? ContactTag { get; set; } // например, @Германиум

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;


        // Навигационные свойства
        public User Owner { get; set; }
        public User ContactUser { get; set; }
    }
}