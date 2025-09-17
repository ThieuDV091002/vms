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
    public class UserEventHandler : 
        IDistributedEventHandler<EntityUpdatedEto<UserEto>>,
        IDistributedEventHandler<EntityDeletedEto<UserEto>>,
        ITransientDependency
    {
      
        private readonly IUserRepository _identityUserRepository;
        private readonly IDataFilter _dataFilter;
        private readonly IObjectMapper _mapper;
        private readonly ILogger<UserEventHandler> _logger;

        public UserEventHandler( IUserRepository identityUserRepository, IDataFilter dataFilter,IObjectMapper mapper,ILogger<UserEventHandler> logger)
        {
            
            _identityUserRepository = identityUserRepository;
            _dataFilter = dataFilter;
            _mapper=mapper;
            _logger = logger;
        }

       

        [UnitOfWork]
        public async Task HandleEventAsync(EntityUpdatedEto<UserEto> eventData)
        {
            try
            {
                var user = await _identityUserRepository.FindAsync(eventData.Entity.Id);
                if (user == null)
                {

                    user = CreateUserEntity(eventData.Entity);
                    await _identityUserRepository.InsertAsync(user);
                    return;
                    
                }

               user=CreateUserEntity(eventData.Entity);
               await _identityUserRepository.UpdateAsync(user);
            }
            catch (Exception ex)
            {
                _logger.LogException(ex);
            }
        }

        [UnitOfWork]
        public async Task HandleEventAsync(EntityDeletedEto<UserEto> eventData)
        {
            try
            {
              await _identityUserRepository.DeleteAsync(eventData.Entity.Id);
            }
            catch (Exception ex)
            {
                _logger.LogException(ex);
            }
        }
        private IdentityUser CreateUserEntity(UserEto user)
        {
            var data = new IdentityUser(user.Id, user.UserName, user.Email, user.TenantId);
            data.Name = user.Name;
            data.Surname = user.Surname;
            data.SetIsActive(user.IsActive);
            data.SetEmailConfirmed(user.EmailConfirmed);
            data.SetPhoneNumber( user.PhoneNumber,user.PhoneNumberConfirmed);
            data.SetPhoneNumberConfirmed ( user.PhoneNumberConfirmed);
            if (user.ExtraProperties.Any())
            {
                foreach (var item in user.ExtraProperties)
                {
                    data.SetProperty(item.Key, item.Value);
                }
            }
            return data;
        }
      
        
    }
}
