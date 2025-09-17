using System;
using System.Linq;
using System.Threading.Tasks;
using Molex.UFE.EntityFrameworkCore;
using Volo.Abp.Domain.Repositories.EntityFrameworkCore;
using Volo.Abp.EntityFrameworkCore;
using Volo.Abp.TenantManagement;

namespace Molex.UFE.Repositories;

public class TenantRepository: EfCoreRepository<UFEDbContext, Tenant, Guid>, ITenantRepository
{
    public TenantRepository(IDbContextProvider<UFEDbContext> dbContextProvider) : base(dbContextProvider)
    {
    }

   
}