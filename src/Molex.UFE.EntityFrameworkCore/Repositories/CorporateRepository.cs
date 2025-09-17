using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper.Internal.Mappers;
using Molex.UFE.EntityFrameworkCore;
using Molex.UFE.Repositories;
using NPOI.SS.Formula.PTG;
using Volo.Abp.Domain.Repositories.EntityFrameworkCore;
using Volo.Abp.EntityFrameworkCore;
using Volo.Abp.ObjectMapping;

namespace Molex.UFE;

public class CorporateRepository : NameObjectNonTenantRepository<Corporate, Guid>, ICorporateRepository
{
    private readonly ICorporateRepository _repository;
    private readonly IDivisionRepository _divisionRepository;
    private readonly ISiteRepository _siteRepository;
    private readonly IAreaRepository _areaRepository;
    private readonly ICellRepository _cellRepository;
    private readonly IWorkCenterRepository _workCenterRepository;
    public CorporateRepository(IDbContextProvider<UFEDbContext> dbContextProvider, IDivisionRepository divisionRepository,
        ISiteRepository siteRepository,
        IAreaRepository areaRepository,
        ICellRepository cellRepository,
        IWorkCenterRepository workCenterRepository) : base(dbContextProvider)
    {
        _divisionRepository = divisionRepository;
        _siteRepository = siteRepository;
        _areaRepository = areaRepository;
        _cellRepository = cellRepository;
        _workCenterRepository = workCenterRepository;
    }

    public override async Task<IQueryable<Corporate>> WithDetailsAsync()
    {
        return (await GetQueryableAsync()).IncludeDetails();
    }
    public override async Task<List<Corporate>> GetListAsync(bool includeDetails = false, CancellationToken cancellationToken = default)
    {
       // return base.GetListAsync(includeDetails, cancellationToken);
        var query = from corporate in await base.GetQueryableAsync()

                    join division in await _divisionRepository.GetQueryableAsync() on corporate.Id equals division.Corporate into divisionGroup
                    from division in divisionGroup.DefaultIfEmpty()

                    join site in await _siteRepository.GetQueryableAsync() on division.Id equals site.Division into siteGroup
                    from site in siteGroup.DefaultIfEmpty()

                    join area in await _areaRepository.GetQueryableAsync() on site.Id equals area.Site into areaGroup
                    from area in areaGroup.DefaultIfEmpty()

                    join cell in await _cellRepository.GetQueryableAsync() on area.Id equals cell.Area into cellGroup
                    from cell in cellGroup.DefaultIfEmpty()

                    join workcenter in await _workCenterRepository.GetQueryableAsync() on cell.Id equals workcenter.Cell into workcenterGroup
                    from workcenter in workcenterGroup.DefaultIfEmpty()
                    select new { corporate, division, site, area, cell, workcenter };
        var list = await AsyncExecuter.ToListAsync(query);
        if (list?.Any() ?? false)
        {
            var corporates = list.Select(x=>x.corporate).DistinctBy(x=>x.Id).ToList();
            foreach (var corporateDto in corporates)
            {
                corporateDto.Divisions = list.Select(x => x.division)?.ToList()?.Where(x => x != null)?.DistinctBy(d => d.Id).ToList() ?? new List<Division>();
                foreach (var d in corporateDto.Divisions)
                {
                    d.Sites = list.Select(x => x.site)?.Where(x => x?.Division == d.Id)?.Select(x => x)?.Where(x => x != null).DistinctBy(s => s.Id).ToList() ?? [];
                    foreach (var site in d.Sites)
                    {
                        site.Areas = list.Select(x => x.area)?.Where(x => x?.Site == site.Id)?.Select(x => x)?.Where(x => x != null).DistinctBy(a => a.Id).ToList() ?? [];
                        foreach (var area in site.Areas)
                        {
                            area.Cells = list.Select(x => x.cell)?.Where(x => x?.Area == area.Id)?.Select(x => x)?.Where(x => x != null).DistinctBy(c => c.Id).ToList() ?? [];
                            foreach (var cell in area.Cells)
                            {
                                cell.WorkCenters = list.Select(x => x.workcenter)?.Where(x => x?.Cell == cell.Id)?.Select(x => x)?.Where(x => x != null).DistinctBy(w => w.Id).ToList() ?? [];
                            }
                        }
                    }
                }
            }
          
           

            return corporates;
        }
        else
        {
            return new List<Corporate>();
        }
    }
   
}