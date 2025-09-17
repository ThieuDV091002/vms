using Molex.UFE.Etos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Domain.Entities.Events.Distributed;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.ObjectMapping;

namespace Molex.UFE.Event
{
    public class DivisionSynchronizer : EntitySynchronizer<Division, Guid, DivisionEto>
    {
        public DivisionSynchronizer(
            IObjectMapper objectMapper,
            IRepository<Division, Guid> repository
            ) : base(objectMapper, repository)
        {            
        }
    }

}
