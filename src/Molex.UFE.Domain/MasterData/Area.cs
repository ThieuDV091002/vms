using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Volo.Abp;

namespace Molex.UFE
{
    public class Area : NameObject<Guid>, ISoftDelete
    {
        public bool IsDeleted { get; set; }
        [Column("SiteId")]
        public Guid Site { get; set; }
        [NotMapped]
        public virtual List<Cell> Cells { get; set; } = new List<Cell>();
    }
}
