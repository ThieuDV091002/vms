using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace Molex.UFE;

public static class AreaEfCoreQueryableExtensions
{
    public static IQueryable<Area> IncludeDetails(this IQueryable<Area> queryable, bool include = true)
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
