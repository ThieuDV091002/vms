using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace Molex.UFE;

public static class CorporateEfCoreQueryableExtensions
{
    public static IQueryable<Corporate> IncludeDetails(this IQueryable<Corporate> queryable, bool include = true)
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
