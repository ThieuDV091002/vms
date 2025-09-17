using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace Molex.UFE;

public static class DivisionEfCoreQueryableExtensions
{
    public static IQueryable<Division> IncludeDetails(this IQueryable<Division> queryable, bool include = true)
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
