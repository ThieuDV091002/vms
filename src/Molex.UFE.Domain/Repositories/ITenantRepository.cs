using System;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.TenantManagement;

namespace Molex.UFE.Repositories;

public interface ITenantRepository:IRepository<Tenant, Guid>
{
    
}