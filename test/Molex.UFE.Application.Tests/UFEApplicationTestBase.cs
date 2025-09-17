using Volo.Abp.Modularity;

namespace Molex.UFE;

public abstract class UFEApplicationTestBase<TStartupModule> : UFETestBase<TStartupModule>
    where TStartupModule : IAbpModule
{

}
