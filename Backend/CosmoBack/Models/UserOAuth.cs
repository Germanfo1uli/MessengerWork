using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace CosmoBack.Models
{
    public class UserOAuth
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(255)]
        public string ProviderUserId { get; set; } = default!; 

        
        [Required]
        [ForeignKey("User")]
        public Guid UserId { get; set; }

        [Required]
        [ForeignKey("OAuthProvider")]
        public Guid ProviderId { get; set; }

        [MaxLength(1024)]
        public string? AccessToken { get; set; }

        [MaxLength(1024)]
        public string? RefreshToken { get; set; }

        public DateTime? AccessTokenExpiry { get; set; }

        // Навигационные свойства
        public User User { get; set; } = default!;
        public OAuthProvider OAuthProvider { get; set; } = default!;
    }
}