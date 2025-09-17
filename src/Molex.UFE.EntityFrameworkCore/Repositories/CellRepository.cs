using System;
using System.Linq;
using System.Threading.Tasks;
using Molex.UFE.EntityFrameworkCore;
using Molex.UFE.Repositories;
using Volo.Abp.Domain.Repositories.EntityFrameworkCore;
using Volo.Abp.EntityFrameworkCore;

namespace Molex.UFE;

public class CellRepository : NameObjectNonTenantRepository<Cell, Guid>, ICellRepository
{
    public override bool ValidateNormalizedName => false;
    public CellRepository(IDbContextProvider<UFEDbContext> dbContextProvider) : base(dbContextProvider)
    {
    }

    public override async Task<IQueryable<Cell>> WithDetailsAsync()
    {
        return (await GetQueryableAsync()).IncludeDetails();
    }
}