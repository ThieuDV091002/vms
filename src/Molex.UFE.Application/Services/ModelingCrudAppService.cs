using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using Molex.UFE.Dtos;
using Molex.UFE.Dtos.Modeling;
using Molex.UFE.Interfaces;
using Molex.UFE.Localization;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.AuditLogging;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.EntityFrameworkCore;
using Volo.Abp.Identity;
using Volo.Abp.TenantManagement;
using Volo.Abp.Uow;
using Volo.Abp.Validation;

namespace Molex.UFE.Services
{
    public abstract class ModelingCrudAppService<TEntity, TEntityDto, TKey, TGetListInput, TCreateInput, TUpdateInput, TExportInput> : CrudAppService<
            TEntity, //The Modeling entity
            TEntityDto, //Used to show Modeling
            TKey, //Primary key of the Modeling entity
            TGetListInput, //Used for paging/sorting
            TCreateInput,
            TUpdateInput>
       where TEntity : class, IEntity<TKey>
        where TEntityDto : class, IEntityDto<TKey>
        where TExportInput:class
    {
        protected virtual string CopyPolicyName { get; set; } = string.Empty;
        protected virtual string ImportPolicyName { get; set; } = string.Empty;
        protected virtual string ExportPolicyName { get; set; } = string.Empty;

        public ModelingCrudAppService(IRepository<TEntity, TKey> repository) : base(repository)
        {
            LocalizationResource = typeof(UFEResource);
        }

        [UnitOfWork]
        public virtual async Task<ImportResultDto> Import(IEnumerable<TExportInput> dtos, OverridingMode mode)
        {
            await CheckPolicyAsync(ImportPolicyName).ConfigureAwait(continueOnCapturedContext: false);

            ImportResultDto result = new ImportResultDto();
            result.Status = true;

            foreach (var dto in dtos)
            {
                string name = CommonHelper.GetPropertyValueByName(dto, UFEConsts.ModelSearchField).ToString();
                string displayName = CommonHelper.GetPropertyValueByName(dto, UFEConsts.DisplayNameField)?.ToString();

                if (string.IsNullOrEmpty(name) && string.IsNullOrEmpty(displayName))
                {
                    continue;
                }

                try
                {
                    TEntity? entity = await GetEntityByNameOrDisplayNameAsync(name, displayName, dto, Repository);

                    if (entity == null)
                    {
                        TEntity entityNew = ObjectMapper.Map<TExportInput, TEntity>(dto);

                        ValidateEntity(dto);
                        SetDisplayNameValue(dto, name, entityNew);
                        CommonHelper.SetPropertyValue(entityNew, UFEConsts.TenantIdField, CurrentTenant.Id);
                        CommonHelper.SetPropertyValue(entityNew, UFEConsts.CreateTimeField, DateTime.Now);

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
                            string errorDetail = ErrorDetailHelper.GetErrorDetail(L["MSG_AlreadyExists"], UFEConsts.ModelingExisted);
                            throw new UserFriendlyException(L["ERROR_ModelingExisted"], UFEDomainErrorCodes.ModelingAlreadyExisted, errorDetail);
                        }
                    }
                }
                catch (UserFriendlyException ex) when (ex.Code == UFEDomainErrorCodes.ModelingAlreadyExisted)
                {
                    string errorDetail = ErrorDetailHelper.GetErrorDetail(L["MSG_AlreadyExists"], UFEConsts.ModelingExisted);
                    throw new UserFriendlyException(L["ERROR_ModelingExisted"], UFEDomainErrorCodes.ModelingAlreadyExisted, errorDetail);
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

        private async Task<TEntity?> GetEntityByNameOrDisplayNameAsync(string name, string displayName, TExportInput dto, IRepository<TEntity, TKey> repository)
        {
            TEntity? entity = await GetEntityByNameAsync(name, dto, repository);
            if (entity == null && string.IsNullOrEmpty(displayName))
            {
                entity = await GetEntityByDisplayNameAsync(displayName, dto, repository);
            }
            return entity;
        }

        private async Task<TEntity?> GetEntityByNameAsync(string name, TExportInput dto, IRepository<TEntity, TKey> repository)
        {
            using (CurrentTenant.Change(null)) // 禁用租户过滤器
            {
                var dbContext = repository.GetDbContext();
                var dbSet = dbContext.Set<TEntity>();
                Guid.TryParse(CommonHelper.GetPropertyValueByName(dto, "TenantId")?.ToString(), out var tenantId);

                var query = dbSet.Where(GenerateQuery(UFEConsts.ModelSearchField, name));

                if (tenantId != Guid.Empty)
                {
                    query = query.Where(GenerateQuery("TenantId", tenantId));
                }

                return await query.SingleOrDefaultAsync();
            }
        }

        private async Task<TEntity?> GetEntityByDisplayNameAsync(string displayName, TExportInput dto, IRepository<TEntity, TKey> repository)
        {
            using (CurrentTenant.Change(null)) // 禁用租户过滤器
            {
                var dbContext = repository.GetDbContext();
                var dbSet = dbContext.Set<TEntity>();
                Guid.TryParse(CommonHelper.GetPropertyValueByName(dto, "TenantId")?.ToString(), out var tenantId);

                var query = dbSet.Where(GenerateQuery(UFEConsts.DisplayNameField, displayName));

                if (tenantId != Guid.Empty)
                {
                    query = query.Where(GenerateQuery("TenantId", tenantId));
                }

                return await query.SingleOrDefaultAsync();
            }
        }

        private static void SetDisplayNameValue(TExportInput dto, string name, TEntity entityNew)
        {
            var displayName = CommonHelper.GetPropertyValueByName(dto, UFEConsts.DisplayNameField);
            if (displayName == null || string.IsNullOrEmpty(displayName.ToString()))
            {
                CommonHelper.SetPropertyValue(entityNew, UFEConsts.DisplayNameField, name);
            }
        }
        protected void AddOneErrorItem(ImportResultDto result, string name, string errorMessage)
        {
            FailedImportResultItemDto item = new FailedImportResultItemDto();
            item.ErrorMessage = errorMessage;
            item.Name = name;
            result.Items.Add(item);
        }

        private void ValidateEntity(TExportInput dto)
        {
            PropertyInfo[] propertyInfos = dto.GetType().GetProperties();

            foreach (PropertyInfo property in propertyInfos)
            {
                if(property.Name== UFEConsts.LastModificationTimeField || property.Name==UFEConsts.CreateTimeField)
                {
                    continue;
                }
                // 确保找到了属性并且它有getter方法  
                if (property != null && property.CanRead)
                {
                    // 调用getter方法获取属性值  
                    if (property.GetValue(dto) == null|| string.IsNullOrEmpty(property.GetValue(dto).ToString()))
                    {
                        string errorDetail = ErrorDetailHelper.GetErrorDetail(L["MSG_MissingValue"], UFEConsts.ModelingRequiredDataNull);
                        throw new UserFriendlyException(L["ERROR_ModelingRequiredDataNull", property.Name], UFEDomainErrorCodes.ModelingRequiredDataIsNull, errorDetail);
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
        //[ApiExplorerSettings(IgnoreApi = true)]
        public virtual async Task<byte[]> Export(FileType fileType, IEnumerable<TKey> ids)
        {
            await CheckPolicyAsync(ExportPolicyName).ConfigureAwait(continueOnCapturedContext: false);

            var query = await Repository.GetQueryableAsync();

            List<TEntity> data = query.Where(h => ids.Contains(h.Id)).ToList();
            List<TExportInput> dtos = data.Select(x => ObjectMapper.Map<TEntity, TExportInput>(x)).ToList();

            string fileName = CommonHelper.GetDownloadFileName(typeof(TEntity).Name, fileType);

            if (fileType == FileType.Excel)
            {
               using MemoryStream ms = ExcelHelper<TExportInput>.WriteObjectToExcelStream(dtos);
                
                return ms.ToArray();
            }

            using MemoryStream jsonMs = CommonHelper.SerializeObjectToJsonStream(dtos);
          
            return jsonMs.ToArray();
        }

        public virtual async Task<byte[]> ExportAll(FileType fileType)
        {
            await CheckPolicyAsync(ExportPolicyName).ConfigureAwait(continueOnCapturedContext: false);

            var query = await Repository.GetQueryableAsync();

            List<TEntity> data = query.ToList();
            List<TExportInput> dtos = data.Select(x => ObjectMapper.Map<TEntity, TExportInput>(x)).ToList();

            string fileName = CommonHelper.GetDownloadFileName(typeof(TEntity).Name, fileType);

            if (fileType == FileType.Excel)
            {
                using MemoryStream ms = ExcelHelper<TExportInput>.WriteObjectToExcelStream(dtos);

                return ms.ToArray();
            }

            using MemoryStream jsonMs = CommonHelper.SerializeObjectToJsonStream(dtos);

            return jsonMs.ToArray();
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
        }

        public virtual async Task<TEntityDto> CopyAsync(TCreateInput input)
        {
            var originalPolicyName = CreatePolicyName;
            try
            {
                CreatePolicyName = new string(CopyPolicyName);
                return await CreateAsync(input);
            }
            finally
            {
                CreatePolicyName = originalPolicyName;
            }
        }
    }
}
