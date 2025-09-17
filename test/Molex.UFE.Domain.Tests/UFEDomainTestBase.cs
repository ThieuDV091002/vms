using Volo.Abp.Modularity;

namespace Molex.UFE;

/* Inherit from this class for your domain layer tests. */
public abstract class UFEDomainTestBase<TStartupModule> : UFETestBase<TStartupModule>
    where TStartupModule : IAbpModule
{

}
