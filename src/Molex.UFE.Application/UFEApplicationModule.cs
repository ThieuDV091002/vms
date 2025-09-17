using Volo.Abp.Account;
using Volo.Abp.Auditing;
using Volo.Abp.AutoMapper;
using Volo.Abp.BlobStoring;
using Volo.Abp.BlobStoring.FileSystem;
using Volo.Abp.Domain.Entities.Events.Distributed;
using Volo.Abp.EventBus.Kafka;
using Volo.Abp.FeatureManagement;
using Volo.Abp.Identity;
using Volo.Abp.Modularity;
using Volo.Abp.PermissionManagement;
using Volo.Abp.SettingManagement;
using Volo.Abp.TenantManagement;

namespace Molex.UFE;

[DependsOn(
    typeof(UFEDomainModule),
    typeof(AbpAccountApplicationModule),
    typeof(UFEApplicationContractsModule),
    typeof(AbpIdentityApplicationModule),
    typeof(AbpPermissionManagementApplicationModule),
    typeof(AbpTenantManagementApplicationModule),
    typeof(AbpFeatureManagementApplicationModule),
    typeof(AbpSettingManagementApplicationModule),
    typeof(AbpBlobStoringModule),
    typeof(AbpBlobStoringFileSystemModule)
    )]
public class UFEApplicationModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        Configure<AbpAutoMapperOptions>(options =>
        {
            options.AddMaps<UFEApplicationModule>();
        });
        Configure<AbpBlobStoringOptions>(options =>
        {
            options.Containers.ConfigureDefault(container =>
            {
                container.UseFileSystem(fileSystem =>
                {
                    fileSystem.BasePath = "data";
                });
            });
        });
        Configure<AbpDistributedEntityEventOptions>(options =>
        {
            options.AutoEventSelectors.Remove<IdentityUser>();
            options.AutoEventSelectors.Remove<Tenant>();
        });        
    }
}
