using System;
using System.Linq;
using System.Threading.Tasks;
using Molex.UFE.EntityFrameworkCore;
using Molex.UFE.Repositories;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Domain.Repositories.EntityFrameworkCore;
using Volo.Abp.EntityFrameworkCore;

namespace Molex.UFE;

public class AreaRepository : NameObjectNonTenantRepository<Area, Guid>, IAreaRepository
{
    public override bool ValidateNormalizedName => false;
    public AreaRepository(IDbContextProvider<UFEDbContext> dbContextProvider) : base(dbContextProvider)
    {
    }

    public override async Task<IQueryable<Area>> WithDetailsAsync()
    {
        return (await GetQueryableAsync()).IncludeDetails();
    }
   
}