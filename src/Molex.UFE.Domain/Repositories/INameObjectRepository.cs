using System.Threading.Tasks;
using Volo.Abp.Domain.Repositories;

namespace Molex.UFE.Repositories;

public interface INameObjectRepository<TEntity,TKey>:INameObjectNonTenantRepository<TEntity, TKey>  where TEntity :  NameObject<TKey>
{
    
}

public interface INameObjectNonTenantRepository<TEntity, TKey> : IRepository<TEntity, TKey>
    where TEntity : NameObjectNonTenant<TKey>
{
    Task<TEntity> FindByNormalizedNameAsync(string normalizedName);
}