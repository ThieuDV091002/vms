using Volo.Abp.Modularity;

namespace Molex.UFE;

[DependsOn(
    typeof(UFEApplicationModule),
    typeof(UFEDomainTestModule)
)]
public class UFEApplicationTestModule : AbpModule
{

}
