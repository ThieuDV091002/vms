using System;
using System.Collections.Generic;
using System.Text;
using Volo.Abp.Application.Dtos;

namespace Molex.UFE.Dtos.Modeling
{
    public class ModelingInputDto<TKey> : PagedAndSortedResultRequestDto
    {
        public TKey Id { get; set; }
    }

}
