using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Volo.Abp;

namespace Molex.UFE;

public class Corporate : NameObject<Guid>, ISoftDelete
{
    public bool IsDeleted { get; set; }
    [NotMapped]
    public virtual List<Division> Divisions { get; set; } = new List<Division>();
}