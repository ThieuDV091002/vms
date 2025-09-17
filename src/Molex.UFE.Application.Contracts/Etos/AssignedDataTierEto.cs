using System;
using Volo.Abp.Domain.Entities.Events.Distributed;
using Volo.Abp.EventBus;
using Volo.Abp.MultiTenancy;

namespace Molex.UFE.Etos
{
    public class AssignedDataTierEto: EntityEto<Guid>, IMultiTenant
    {
        public Guid UserId { get; set; }
        public string DataTierType { get; set; } = "";
        public Guid DataTierId { get; set; }
        public bool IsDefault { get; set; }
        public Guid? TenantId { get; set; } = Guid.Empty;
    }
}
