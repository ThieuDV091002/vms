using Molex.UFE.Dtos;
using System;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Data;
using Volo.Abp.Domain.Entities.Events.Distributed;

namespace Molex.UFE.Etos;

[Serializable]
public class CorporateTenantEto : EntityEto<Guid>
{    
    public string Name { get; set; }
    public string NormalizedName { get; set; }
    public ExtraPropertyDictionary? ExtraProperties { get; set; }
}