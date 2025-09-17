using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace Molex.UFE;

public static class CellEfCoreQueryableExtensions
{
    public static IQueryable<Cell> IncludeDetails(this IQueryable<Cell> queryable, bool include = true)
    {
        if (!include)
        {
            return queryable;
        }

        return queryable
            // .Include(x => x.xxx) // TODO: AbpHelper generated
            ;
    }
}
