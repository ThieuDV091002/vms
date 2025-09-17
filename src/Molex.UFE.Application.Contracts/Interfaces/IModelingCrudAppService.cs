using Molex.UFE.Dtos;
using Molex.UFE.Dtos.Modeling;
using NPOI.POIFS.Crypt;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Entities;

namespace Molex.UFE.Interfaces
{
    public interface IModelingCrudAppService<TEntityDto, TKey, in TGetListInput, in TCreateOrUpdateInput, TExportDto> : ICrudAppService<TEntityDto, TKey, TGetListInput, TCreateOrUpdateInput>
        where TEntityDto : IEntityDto<TKey>
    {
        Task<ImportResultDto> Import(IEnumerable<TExportDto> entities, OverridingMode mode);
        Task<byte[]> Export(FileType fileType, IEnumerable<TKey> ids);
        Task<byte[]> ExportAll(FileType fileType);
        Task<bool> MultipleDelete(IEnumerable<TKey> ids);
        Task<PagedResultDto<ModelingHistoryDto>> GetModelingHistory(ModelingInput<TKey> input);
        Task<TEntityDto> CopyAsync(TCreateOrUpdateInput input);
    }
}
