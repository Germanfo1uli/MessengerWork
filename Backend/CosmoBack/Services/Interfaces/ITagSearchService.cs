using CosmoBack.Models.Dtos;

namespace CosmoBack.Services.Interfaces
{
    public interface ITagSearchService
    {
        Task<IEnumerable<TagSearchDto>> SearchByTagAsync(Guid userId, string tag);
    }
}