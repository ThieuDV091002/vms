using System;
using System.Linq;
using System.Threading.Tasks;
using Molex.UFE.EntityFrameworkCore;
using Molex.UFE.Repositories;
using Volo.Abp.Domain.Repositories.EntityFrameworkCore;
using Volo.Abp.EntityFrameworkCore;

namespace Molex.UFE;

public class WorkCenterRepository : NameObjectNonTenantRepository< WorkCenter, Guid>, IWorkCenterRepository
{
    public override bool ValidateNormalizedName => false;
    public WorkCenterRepository(IDbContextProvider<UFEDbContext> dbContextProvider) : base(dbContextProvider)
    {
    }

    public override async Task<IQueryable<WorkCenter>> WithDetailsAsync()
    {
        return (await GetQueryableAsync()).IncludeDetails();
    }
}