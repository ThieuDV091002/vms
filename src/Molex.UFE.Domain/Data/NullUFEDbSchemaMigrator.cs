using System.Threading.Tasks;
using Volo.Abp.DependencyInjection;

namespace Molex.UFE.Data;

/* This is used if database provider does't define
 * IUFEDbSchemaMigrator implementation.
 */
public class NullUFEDbSchemaMigrator : IUFEDbSchemaMigrator, ITransientDependency
{
    public Task MigrateAsync()
    {
        return Task.CompletedTask;
    }
}
