using AutoMapper.Internal.Mappers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using Microsoft.VisualBasic.FileIO;
using Molex.UFE.Dtos;
using Molex.UFE.Localization;
using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.AuditLogging;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Uow;
using Volo.Abp.Validation;
using System.Linq;


namespace Molex.UFE.Services
{
    public abstract class NameObjectAppService<TEntity, TEntityDto, TKey, TGetListInput, TCreateUpdateInput, TExportInput> : ModelingCrudAppService<
            TEntity, //The Modeling entity
            TEntityDto, //Used to show Modeling
            TKey, //Primary key of the Modeling entity
            TGetListInput, //Used for paging/sorting
            TCreateUpdateInput,
            TCreateUpdateInput,
            TExportInput>
        where TEntity : NameObject<TKey>
        where TEntityDto : NameObjectDto<TKey>, new()
        where TCreateUpdateInput : CreateUpdateNameObjectDto
        where TExportInput : class
    {

        protected NameObjectAppService(IRepository<TEntity, TKey> repository) : base(repository)
        {
            LocalizationResource = typeof(UFEResource);
        }

        public virtual async Task<TEntityDto> CreateOrUpdateAsync(TCreateUpdateInput data)
        {
            data.Name = data.Name.Trim();
            var dbContext = await Repository.GetDbContextAsync();
            var dbSet = dbContext.Set<TEntity>();
            var trimmedUpperName = data.Name.ToUpper();
            var query = from e in dbContext.Set<TEntity>()
                        where e.NormalizedName == trimmedUpperName
                        select e;
            if (query.Any())
            {
                var id = query.First().Id;
                await CheckPolicyAsync(UpdatePolicyName).ConfigureAwait(continueOnCapturedContext: false);
                return await this.UpdateAsync(id, data);

            }
            else
            {
                await CheckPolicyAsync(CreatePolicyName).ConfigureAwait(continueOnCapturedContext: false);
                return await this.CreateAsync(data);
            }
        }

        public override async Task<TEntityDto> CreateAsync(TCreateUpdateInput input)
        {
            input.Name = input.Name.Trim();
            return await base.CreateAsync(input);
        }

        public override async Task<TEntityDto> UpdateAsync(TKey id, TCreateUpdateInput input)
        {
            input.Name = input.Name.Trim();
            return await base.UpdateAsync(id, input);
        }

        public virtual async Task<IEnumerable<TEntityDto>> GetAllInstancesAsync()
        {
            await CheckPolicyAsync(GetPolicyName).ConfigureAwait(continueOnCapturedContext: false);
            var query = await Repository.GetQueryableAsync();
            var s = query.ToQueryString();
            var list = query.Select(x => new TEntityDto() { Name = x.Name, Id = x.Id }).OrderBy(x => x.Name).ToList();
            return list;

        }
        public virtual async Task<TEntityDto?> GetByNameAsync(string name)
        {
            await CheckPolicyAsync(GetPolicyName).ConfigureAwait(continueOnCapturedContext: false);
            var dbContext = await Repository.GetDbContextAsync();
            var dbSet = dbContext.Set<TEntity>();
            var query = from e in dbContext.Set<TEntity>()
                        where e.Name == name
                        select ObjectMapper.Map<TEntity, TEntityDto>(e);
            return query.FirstOrDefault();
        }
        [UnitOfWork]
        [HttpPut]
        public virtual async Task<IEnumerable<TEntityDto>> MultipleUpdateAsync(Dictionary<TKey, TCreateUpdateInput> inputs)
        {
            await CheckPolicyAsync(UpdatePolicyName).ConfigureAwait(continueOnCapturedContext: false);
            var list = new List<TEntityDto>();
            foreach (var key in inputs.Keys)
            {
                list.Add(await base.UpdateAsync(key, inputs[key]));
            }
            return list;

        }

        [HttpPost]
        public virtual async Task<IEnumerable<TEntityDto>> GetExistInstancesAsync(IEnumerable<TExportInput> entities)
        {
            await CheckPolicyAsync(GetPolicyName).ConfigureAwait(continueOnCapturedContext: false);

            var normalizedNames = entities.Select(x => CommonHelper.GetPropertyValueByName(x, UFEConsts.ModelSearchField)?.ToString()?.Trim())
                                .Where(n => n != null)
                                .Select(n => n!.ToUpperInvariant()).ToList();

            if (normalizedNames.Count == 0)
            {
                return new List<TEntityDto>();
            }

            var query = (await Repository.GetQueryableAsync()).Where(e => normalizedNames.Contains(e.NormalizedName));
            var data = await AsyncExecuter.ToListAsync(query);
            return data.Select(x => ObjectMapper.Map<TEntity, TEntityDto>(x)).ToList();
        }


        /*[UnitOfWork]
        public virtual async Task<ImportResultDto> Import(IEnumerable<TExportInput> dtos, OverridingMode mode)
        {
            await CheckPolicyAsync(CreatePolicyName).ConfigureAwait(continueOnCapturedContext: false);

            ImportResultDto result = new ImportResultDto();
            result.Status = true;

            foreach (var dto in dtos)
            {
                string name = CommonHelper.GetPropertyValueByName(dto,"Name").ToString();

                try
                {
                    TEntity? entity = await GetEntityByNameAsync(name, dto, Repository);

                    if (entity == null)
                    {
                        TEntity entityNew = ObjectMapper.Map<TExportInput, TEntity>(dto);

                        ValidateEntity(dto);
                        CommonHelper.SetPropertyValue(entityNew, "TenantId", CurrentTenant.Id);
                        CommonHelper.SetPropertyValue(entityNew, "CreationTime", DateTime.Now);

                        await Repository.InsertAsync(entityNew);
                    }
                    else
                    {
                        if (mode == OverridingMode.Overwrite)
                        {
                            UFEApplicationAutoMapperProfile.MapNotNullProperty(dto, entity);
                            await Repository.UpdateAsync(entity);
                        }
                        else if (mode == OverridingMode.Skip)
                        {
                            continue;
                        }
                        else
                        {
                            throw new UserFriendlyException(L.GetString(UFEConsts.ModelingExisted), UFEDomainErrorCodes.ModelingAlreadyExisted);
                        }
                    }
                }
                catch (UserFriendlyException ex) when (ex.Code == UFEDomainErrorCodes.ModelingAlreadyExisted)
                {
                    throw new UserFriendlyException(L.GetString(UFEConsts.ModelingExisted), UFEDomainErrorCodes.ModelingAlreadyExisted);
                }
                catch (AbpValidationException ex)
                {
                    AddOneErrorItem(result, name, ex.ValidationErrors.FirstOrDefault()?.ErrorMessage);
                }
                catch (Exception ex)
                {
                    AddOneErrorItem(result, name, ex.Message);
                }
            }

            if (result.Items.Count > 0)
            {
                result.Status = false;
            }
            return result;
        }

        protected void AddOneErrorItem(ImportResultDto result, string name, string errorMessage)
        {
            ImportResultItemDto item = new ImportResultItemDto();
            item.ErrorMessage = errorMessage;
            item.Name = name;
            result.Items.Add(item);
        }

        private void ValidateEntity(TExportInput dto)
        {
            PropertyInfo[] propertyInfos = dto.GetType().GetProperties();

            foreach (PropertyInfo property in propertyInfos)
            {
                if (property.Name == "LastModificationTime" || property.Name == "CreationTime")
                {
                    continue;
                }
                
                if (property != null && property.CanRead)
                {
                    
                    if (property.GetValue(dto) == null || string.IsNullOrEmpty(property.GetValue(dto).ToString()))
                    {
                        string errorMessage = string.Format(L.GetString(UFEConsts.ModelingRequiredDataNull), property.Name);
                        throw new UserFriendlyException(errorMessage, UFEDomainErrorCodes.ModelingRequiredDataIsNull);
                    }
                }
            }
        }

        [UnitOfWork]
        public virtual async Task<bool> MultipleDelete(IEnumerable<TKey> ids)
        {
            await CheckPolicyAsync(DeletePolicyName).ConfigureAwait(continueOnCapturedContext: false);

            await Repository.DeleteManyAsync(ids);
            return true;
        }
        public virtual async Task<byte[]> Export(FileType fileType, IEnumerable<TKey> ids)
        {
            await CheckPolicyAsync(GetPolicyName).ConfigureAwait(continueOnCapturedContext: false);

            var query = await Repository.GetQueryableAsync();

            List<TEntity> data = query.Where(h => ids.Contains(h.Id)).ToList();
            List<TExportInput> dtos = data.Select(x => ObjectMapper.Map<TEntity, TExportInput>(x)).ToList();

            string fileName = CommonHelper.GetDownloadFileName(typeof(TEntity).Name, fileType);

            if (fileType == FileType.Excel)
            {
                using (MemoryStream ms = ExcelHelper<TExportInput>.WriteObjectToExcelStream(dtos))
                {
                    return ms.ToArray();
                }
                    
            }
            using (MemoryStream jsonMs = CommonHelper.SerializeObjectToJsonStream(dtos))
            {
                return jsonMs.ToArray();
            }
        }

        public virtual async Task<PagedResultDto<ModelingHistoryDto>> GetModelingHistory(ModelingInput<TKey> input)
        {
            await CheckPolicyAsync(GetPolicyName).ConfigureAwait(continueOnCapturedContext: false);

            var context = Repository.GetDbContext();

            var query = from auditLog in context.Set<AuditLog>()
                        join entityChange in context.Set<EntityChange>() on auditLog.Id equals entityChange.AuditLogId
                        //join propertyChange in context.Set<EntityPropertyChange>() on entityChange.Id equals propertyChange.EntityChangeId
                        where entityChange.EntityId == input.Id.ToString()
                        select new { entityChange.Id, auditLog.UserName, auditLog.ExecutionTime, entityChange.ChangeType };

            //Paging
            var pageingQuery = query
                .OrderBy(m => m.ExecutionTime)
                .Skip(input.SkipCount)
                .Take(input.MaxResultCount);

            //Execute the query and get a list
            var queryResult = await AsyncExecuter.ToListAsync(pageingQuery);

            //Convert the query result to a list of BookDto objects
            var modelingHistoryDtos = queryResult.Select(x =>
            {
                var historyDto = new ModelingHistoryDto();
                historyDto.Id = x.Id;
                historyDto.UserName = x.UserName;
                historyDto.ExecutionTime = x.ExecutionTime.ToString();
                historyDto.ChangeType = x.ChangeType.ToString();
                return historyDto;
            }).ToList();


            foreach (var item in modelingHistoryDtos)
            {
                await SetHistoryProperty(context, item);
            }

            //Get the total count
            var totalCount = query.Count();
            return new PagedResultDto<ModelingHistoryDto>(
                totalCount,
                modelingHistoryDtos
            );
        }

        private async Task SetHistoryProperty(DbContext context, ModelingHistoryDto? item)
        {
            var propertyQuery = from propertyChange in context.Set<EntityPropertyChange>()
                                where propertyChange.EntityChangeId == item.Id
                                select new { propertyChange.PropertyName, propertyChange.OriginalValue, propertyChange.NewValue };

            var propertyQueryResult = await AsyncExecuter.ToListAsync(propertyQuery);

            var historyPropertyDtos = propertyQueryResult.Select(x =>
            {
                var historyDto = new ModelingPropertyDto();
                historyDto.PropertyName = x.PropertyName;
                historyDto.OriginalValue = x.OriginalValue;
                historyDto.NewValue = x.NewValue;
                return historyDto;
            }).ToList();

            item.Children = historyPropertyDtos;
        }

        private async Task<TEntity> GetEntityByNameAsync(string name, TExportInput dto, IRepository<TEntity, TKey> repository)
        {
            using (CurrentTenant.Change(null)) 
            {
                var dbContext = repository.GetDbContext();
                var dbSet = dbContext.Set<TEntity>();
                Guid.TryParse(CommonHelper.GetPropertyValueByName(dto, "TenantId")?.ToString(), out var tenantId);

                //Guid? tenantId = Guid.Parse(CommonHelper.GetPropertyValueByName(dto, "TenantId").ToString());

                var query = dbSet.Where(GenerateQuery("Name", name));

                if (tenantId != Guid.Empty)
                {
                    query = query.Where(GenerateQuery("TenantId", tenantId));
                }

                return await query.SingleOrDefaultAsync();
            }
        }

        private Expression<Func<TEntity, bool>> GenerateQuery(string name, object value)
        {
            // 使用EF.Property来动态访问属性  
            var parameter = Expression.Parameter(typeof(TEntity), "e");
            var property = typeof(TEntity).GetProperty(name);

            var namePropertyAccess = Expression.Property(parameter, property);
            var nameConstant = Expression.Constant(value, value.GetType());

            if (name == "TenantId")
            {
                var nullableValue = (Guid?)value;
                nameConstant = Expression.Constant(nullableValue, typeof(Guid?));
            }
            var equalsExpression = Expression.Equal(namePropertyAccess, nameConstant);

            var lambda = Expression.Lambda<Func<TEntity, bool>>(equalsExpression, parameter);

            return lambda;
        }*/

    }
}
