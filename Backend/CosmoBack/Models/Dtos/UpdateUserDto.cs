using System.ComponentModel.DataAnnotations;

namespace CosmoBack.Models.Dtos
{
    public class UpdateUserDto
    {
        [Required]
        public Guid Id { get; set; }

        [MaxLength(50)]
        public string? Username { get; set; }

        [MaxLength(15)]
        public string? Phone { get; set; }

        [MaxLength(500)]
        public string? Bio { get; set; }

        [MaxLength(50)]
        public string? PublicName { get; set; }

        public Theme? Theme { get; set; }

        public Guid? AvatarImageId { get; set; }
    }
}