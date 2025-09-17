using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using Molex.UFE.EntityFrameworkCore;
using Molex.UFE.Repositories;
using Volo.Abp.Domain.Repositories.EntityFrameworkCore;
using Volo.Abp.EntityFrameworkCore;

namespace Molex.UFE;

public class DivisionRepository : NameObjectNonTenantRepository< Division, Guid>, IDivisionRepository
{
    public override bool ValidateNormalizedName => false;
    public DivisionRepository(IDbContextProvider<UFEDbContext> dbContextProvider) : base(dbContextProvider)
    {
    }

    public override async Task<IQueryable<Division>> WithDetailsAsync()
    {
        return (await GetQueryableAsync()).IncludeDetails();
    }

    public override Task<List<Division>> GetListAsync(Expression<Func<Division, bool>> predicate, bool includeDetails = false, CancellationToken cancellationToken = default)
    {
        return base.GetListAsync(predicate, includeDetails, cancellationToken);
    }
}