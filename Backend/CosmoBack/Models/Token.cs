using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace CosmoBack.Models
{
    public class Token
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [ForeignKey("User")]
        public Guid UserId { get; set; }

        [Required]
        [MaxLength(50)]
        public string Name { get; set; } = default!; 

        [Required]
        [MaxLength(255)]
        public string ClientId { get; set; } = default!;

        [Required]
        [MaxLength(255)]
        public string ClientSecret { get; set; } = default!; // Зашифровать!

        [Required]
        [MaxLength(255)]
        public string AuthorizationEndpoint { get; set; } = default!;

        [Required]
        [MaxLength(255)]
        public string TokenEndpoint { get; set; } = default!;

        [MaxLength(255)]
        public string? UserInfoEndpoint { get; set; }

        // Навигационное свойство
        public List<UserOAuth> UserOAuths { get; set; } = new();
        public User User { get; set; } = default!;
    }
}