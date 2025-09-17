using System.Threading.Tasks;

namespace Molex.UFE.Data;

public interface IUFEDbSchemaMigrator
{
    Task MigrateAsync();
}
