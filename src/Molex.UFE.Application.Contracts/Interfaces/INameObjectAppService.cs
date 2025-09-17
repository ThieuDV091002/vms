using Molex.UFE.Dtos;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace Molex.UFE.Interfaces
{
    public interface INameObjectAppService<TEntityDto, TKey, TGetListInput, TCreateOrUpdateInput, TExportDto> : IModelingCrudAppService<TEntityDto, TKey, TGetListInput, TCreateOrUpdateInput, TExportDto>
        where TEntityDto : NameObjectDto<TKey>
    {
        Task<TEntityDto> CreateOrUpdateAsync(TCreateOrUpdateInput data);
        Task<TEntityDto?> GetByNameAsync(string name);
        Task<IEnumerable<TEntityDto>> GetAllInstancesAsync();
        Task<IEnumerable<TEntityDto>> MultipleUpdateAsync(Dictionary<TKey, TCreateOrUpdateInput> inputs);
        Task<IEnumerable<TEntityDto>> GetExistInstancesAsync(IEnumerable<TExportDto> entities);
    }
}
