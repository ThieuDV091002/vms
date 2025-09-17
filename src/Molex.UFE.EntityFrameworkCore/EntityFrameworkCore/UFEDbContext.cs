using Microsoft.EntityFrameworkCore;
using Volo.Abp.AuditLogging;
using Volo.Abp.AuditLogging.EntityFrameworkCore;
using Volo.Abp.BackgroundJobs.EntityFrameworkCore;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.EntityFrameworkCore;
using Volo.Abp.FeatureManagement.EntityFrameworkCore;
using Volo.Abp.Identity;
using Volo.Abp.Identity.EntityFrameworkCore;
using Volo.Abp.OpenIddict.EntityFrameworkCore;
using Volo.Abp.PermissionManagement.EntityFrameworkCore;
using Volo.Abp.SettingManagement.EntityFrameworkCore;
using Volo.Abp.TenantManagement;
using Volo.Abp.TenantManagement.EntityFrameworkCore;
using Molex.UFE;
using Volo.Abp.EntityFrameworkCore.Modeling;

namespace Molex.UFE.EntityFrameworkCore;

[ConnectionStringName("Default")]
public class UFEDbContext :
    AbpDbContext<UFEDbContext>
{
    /* Add DbSet properties for your Aggregate Roots / Entities here. */

  
    public DbSet<IdentityUser> Users { get; set; }
    #region master data
    public DbSet<Corporate> Corporates { get; set; }
    public DbSet<Division> Divisions { get; set; }
    public DbSet<Site> Sites { get; set; }
    public DbSet<Area> Areas { get; set; }
    public DbSet<Cell> Cells { get; set; }
    public DbSet<WorkCenter> WorkCenters { get; set; }

    #endregion
  

  
   

    public UFEDbContext(DbContextOptions<UFEDbContext> options)
        : base(options)
    {

    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        /* Include modules to your migration db context */

        builder.ConfigurePermissionManagement();
        builder.ConfigureSettingManagement();
        builder.ConfigureBackgroundJobs();
        builder.ConfigureAuditLogging();
        builder.ConfigureIdentity();
        builder.ConfigureOpenIddict();
        builder.ConfigureFeatureManagement();
        builder.ConfigureTenantManagement();

        /* Configure your own tables/entities inside here */

        //builder.Entity<YourEntity>(b =>
        //{
        //    b.ToTable(UFEConsts.DbTablePrefix + "YourEntities", UFEConsts.DbSchema);
        //    b.ConfigureByConvention(); //auto configure for the base class props
        //    //...
        //});
        builder.Entity<Corporate>(b =>
        {
            b.ToTable(UFEConsts.DbTablePrefix + "Corporates", UFEConsts.DbSchema);
            b.HasIndex(x => x.Name);
            b.ConfigureByConvention();


            /* Configure more properties here */
        });


        builder.Entity<Division>(b =>
        {
            b.ToTable(UFEConsts.DbTablePrefix + "Divisions", UFEConsts.DbSchema);
            b.HasIndex(x => x.Name);
            b.HasIndex(x => x.Corporate);
            b.ConfigureByConvention();


            /* Configure more properties here */
        });


        builder.Entity<Site>(b =>
        {
            b.ToTable(UFEConsts.DbTablePrefix + "Sites", UFEConsts.DbSchema);
            b.HasIndex(x => x.Name);
            b.HasIndex(x => x.Division);
            b.ConfigureByConvention();


            /* Configure more properties here */
        });

        builder.Entity<Area>(b =>
        {
            b.ToTable(UFEConsts.DbTablePrefix + "Areas", UFEConsts.DbSchema);
            b.HasIndex(x => x.Name);
            b.HasIndex(x => x.Site);
            b.ConfigureByConvention();


            /* Configure more properties here */
        });


        builder.Entity<Cell>(b =>
        {
            b.ToTable(UFEConsts.DbTablePrefix + "Cells", UFEConsts.DbSchema);
            b.HasIndex(x => x.Name);
            b.HasIndex(x => x.Area);
            b.ConfigureByConvention();

            /* Configure more properties here */
        });


        builder.Entity<WorkCenter>(b =>
        {
            b.ToTable(UFEConsts.DbTablePrefix + "WorkCenters", UFEConsts.DbSchema);
            b.HasIndex(x => x.Name);
            b.HasIndex(x => x.Cell);
            b.ConfigureByConvention();


            /* Configure more properties here */
        });

       

        builder.Entity<EntityChange>(b =>
        {
            b.HasIndex(x => x.EntityId);
        });

        builder.Entity<EntityPropertyChange>(b =>
        {
            b.HasIndex(x => x.PropertyName);
        });
    }
}
