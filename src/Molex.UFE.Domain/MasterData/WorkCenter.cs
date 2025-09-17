using System;
using System.ComponentModel.DataAnnotations.Schema;
using Volo.Abp;

namespace Molex.UFE
{
    public class WorkCenter : NameObject<Guid>, ISoftDelete
    {
        public bool IsDeleted { get; set; }
        [Column("CellId")]
        public Guid Cell { get; set; }
    }
}
