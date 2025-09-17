using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Volo.Abp;

namespace Molex.UFE;

public class Division : NameObject<Guid>, ISoftDelete
{
    public bool IsDeleted { get; set; }
    [Column("CorporateId")]
    public Guid Corporate { get; set; }

    [NotMapped]
    public virtual List<Site> Sites { get; set; } = new List<Site>();
}