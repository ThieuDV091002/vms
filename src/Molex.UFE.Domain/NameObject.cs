using System; 
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Molex.UFE
{
    public abstract class NameObject<Tkey> : NameObjectNonTenant<Tkey>, IMultiTenant
    {
      
       
        public Guid? TenantId { get; set; } = Guid.Empty;
        [NotMapped]
        public string TenantName { get; set; } = string.Empty;

      
    }
    [Index(nameof(NormalizedName))]
    [Index(nameof(Name))]
    public abstract class NameObjectNonTenant<Tkey> : AuditedAggregateRoot<Tkey>
    {

        [Required]
        public string Name { get; set; }
        public string? Description { get; set; } = "";
        public string DisplayName { get; set; }
       
        public string NormalizedName { get; set; }
    }
}
