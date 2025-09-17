using System;
using System.Linq;
using System.Threading.Tasks;
using Molex.UFE.EntityFrameworkCore;
using Molex.UFE.Repositories;
using Volo.Abp.Domain.Repositories.EntityFrameworkCore;
using Volo.Abp.EntityFrameworkCore;

namespace Molex.UFE;

public class SiteRepository : NameObjectNonTenantRepository< Site, Guid>, ISiteRepository
{
    public override bool ValidateNormalizedName => false;
    public SiteRepository(IDbContextProvider<UFEDbContext> dbContextProvider) : base(dbContextProvider)
    {
    }

    public override async Task<IQueryable<Site>> WithDetailsAsync()
    {
        return (await GetQueryableAsync()).IncludeDetails();
    }
}