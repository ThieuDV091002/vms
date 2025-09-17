using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Data;

namespace Molex.UFE.Dtos
{
    public abstract class NameObjectDto<Tkey> : ExtensibleAuditedEntityDto<Tkey>
    {
        public virtual string Name { get; set; }

        public virtual string Description { get; set; }
        public virtual Guid? TenantId { get; set; }
        public virtual string TenantName { get; set; } = string.Empty;
        public virtual string NormalizedName { get; set; }
        public virtual string DisplayName { get; set; }

        public virtual string Creator { get; set; }
        public virtual string LastModifier { get; set; }
    }
    public abstract class CreateUpdateNameObjectDto
    {
        [Required]
        [StringLength(400)]
        public virtual string Name { get; set; } 

        public virtual string? Description { get; set; } = "";

        public virtual Guid? TenantId { get; set; } 
        public virtual string? TenantName { get; set; } = "";
        public virtual string? DisplayName { get; set; } = "";
        public ExtraPropertyDictionary? ExtraProperties { get; set; } = new ExtraPropertyDictionary();
    }
    public abstract class GetNameObjectInput : PagedAndSortedResultRequestDto
    {
        public virtual string Filter { get; set; } = "%";
    }
}
