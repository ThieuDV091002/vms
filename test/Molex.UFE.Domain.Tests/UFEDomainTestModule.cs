using Volo.Abp.Modularity;

namespace Molex.UFE;

[DependsOn(
    typeof(UFEDomainModule),
    typeof(UFETestBaseModule)
)]
public class UFEDomainTestModule : AbpModule
{

}
