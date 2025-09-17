using Molex.UFE.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Domain.Repositories.EntityFrameworkCore;
using Volo.Abp.EntityFrameworkCore;
using Volo.Abp.Identity;
using Volo.Abp.Identity.EntityFrameworkCore;

namespace Molex.UFE.Repositories
{
    public class UserRepository : EfCoreRepository<UFEDbContext, IdentityUser, Guid>, IUserRepository
    {
        public UserRepository(IDbContextProvider<UFEDbContext> dbContextProvider) : base(dbContextProvider)
        {
        }

        public override async Task<IQueryable<IdentityUser>> WithDetailsAsync()
        {
            return (await GetQueryableAsync()).IncludeDetails();
        }
    }
}
