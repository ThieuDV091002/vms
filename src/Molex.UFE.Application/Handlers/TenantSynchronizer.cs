using System.Threading.Tasks;
using Molex.UFE.Etos;
using Volo.Abp.Domain.Entities.Events.Distributed;
using Volo.Abp.ObjectMapping;
using Volo.Abp.TenantManagement;
using Volo.Abp.Users;
using ITenantRepository = Molex.UFE.Repositories.ITenantRepository;

namespace Molex.UFE.Handlers;

public class TenantSynchronizer: EntitySynchronizer<Tenant, CorporateTenantEto>
{
    public TenantSynchronizer(
        IObjectMapper objectMapper,
        ITenantRepository repository
    ) : base(objectMapper, repository)
    {            
    }

    protected override Task<Tenant?> FindLocalEntityAsync(CorporateTenantEto eto)
    {
        return  Repository.FindAsync(x=>x.Id==eto.Id);   
    }
}