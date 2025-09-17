using Microsoft.Extensions.Logging;
using Molex.UFE.Repositories;
using System;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Entities.Events.Distributed;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.EventBus.Distributed;
using Volo.Abp.Identity;
using Volo.Abp.MultiTenancy;
using Volo.Abp.ObjectMapping;
using Volo.Abp.Uow;
using Volo.Abp.Users;


namespace Molex.UFE.Event
{
    public class UserSynchronizer : EntitySynchronizer<IdentityUser, UserEto>
    {
        public UserSynchronizer(
            IObjectMapper objectMapper,
            IUserRepository repository
        ) : base(objectMapper, repository)
        {            
        }

        protected override Task<IdentityUser?> FindLocalEntityAsync(UserEto eto)
        {
           return  Repository.FindAsync(x=>x.Id==eto.Id);   
        }
    }
}
