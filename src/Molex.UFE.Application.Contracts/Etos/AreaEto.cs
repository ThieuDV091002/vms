using System;
using Volo.Abp;
using Volo.Abp.Data;
using Volo.Abp.Domain.Entities.Events.Distributed;

namespace Molex.UFE.Etos;

[Serializable]
public class AreaEto : EntityEto<Guid>, ISoftDelete
{
    public string Name { get; set; }
    public string Description { get; set; }
    public string DisplayName { get; set; }    
    public Guid Site { get; set; }
    public ExtraPropertyDictionary? ExtraProperties { get; set; }
    public bool IsDeleted { get; set; }
}
