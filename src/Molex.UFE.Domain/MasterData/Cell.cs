using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Volo.Abp;

namespace Molex.UFE
{
    public class Cell : NameObject<Guid>, ISoftDelete
    {
        public bool IsDeleted { get; set; }
        [Column("AreaId")]
        public Guid Area { get; set; }
        [NotMapped]
        public virtual List<WorkCenter> WorkCenters { get; set; } = new List<WorkCenter>();

    }
}
