using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Molex.UFE.Data;
using Volo.Abp.DependencyInjection;

namespace Molex.UFE.EntityFrameworkCore;

public class EntityFrameworkCoreUFEDbSchemaMigrator
    : IUFEDbSchemaMigrator, ITransientDependency
{
    private readonly IServiceProvider _serviceProvider;

    public EntityFrameworkCoreUFEDbSchemaMigrator(
        IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    public async Task MigrateAsync()
    {
        /* We intentionally resolve the UFEDbContext
         * from IServiceProvider (instead of directly injecting it)
         * to properly get the connection string of the current tenant in the
         * current scope.
         */

        await _serviceProvider
            .GetRequiredService<UFEDbContext>()
            .Database
            .MigrateAsync();
    }
}
