using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Volo.Abp;

namespace Molex.UFE;

public class Site : NameObject<Guid>, ISoftDelete
{
    public bool IsDeleted { get; set; }
    [Column("DivisionId")]
    public Guid Division { get; set; }

    public string SAPSiteCode { get; set; }

    [NotMapped]
    public virtual List<Area> Areas { get; set; } = new List<Area>();
}
