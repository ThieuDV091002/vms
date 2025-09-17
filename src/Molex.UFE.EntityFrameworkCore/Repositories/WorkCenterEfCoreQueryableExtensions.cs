using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace Molex.UFE;

public static class WorkCenterEfCoreQueryableExtensions
{
    public static IQueryable<WorkCenter> IncludeDetails(this IQueryable<WorkCenter> queryable, bool include = true)
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
