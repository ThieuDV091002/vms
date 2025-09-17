using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace Molex.UFE;

public static class SiteEfCoreQueryableExtensions
{
    public static IQueryable<Site> IncludeDetails(this IQueryable<Site> queryable, bool include = true)
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
