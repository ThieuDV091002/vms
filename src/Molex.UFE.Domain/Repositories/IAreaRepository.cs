using System;
using Molex.UFE.Repositories;
using Volo.Abp.Domain.Repositories;

namespace Molex.UFE;

public interface IAreaRepository : INameObjectNonTenantRepository<Area, Guid>
{
}
