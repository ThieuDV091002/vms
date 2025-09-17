using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Policy;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using Molex.UFE;
using Molex.UFE.Localization;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Volo.Abp.Authorization;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Identity;
using Volo.Abp.PermissionManagement;

public class CustomAuthorizationMiddlewareResultHandler : IAuthorizationMiddlewareResultHandler
{
    private readonly AuthorizationMiddlewareResultHandler _defaultHandler = new();

    private readonly IStringLocalizerFactory _localizerFactory;
    IPermissionDefinitionManager _permissionDefinitionManager;
    public CustomAuthorizationMiddlewareResultHandler(IStringLocalizerFactory localizerFactory, IPermissionDefinitionManager permissionDefinitionManager)
    {
        _localizerFactory = localizerFactory;
        _permissionDefinitionManager = permissionDefinitionManager;
    }
    public async Task HandleAsync(
        RequestDelegate next,
        HttpContext context,
        AuthorizationPolicy policy,
        PolicyAuthorizationResult authorizeResult)
    {
        if (!authorizeResult.Succeeded)
        {
            var localizer = _localizerFactory.Create<UFEResource>();
            var permissionsGroup = await _permissionDefinitionManager.GetGroupsAsync();
            var permissions = await _permissionDefinitionManager.GetPermissionsAsync();
            var requiredPermissions = policy.Requirements
                .OfType<Volo.Abp.Authorization.PermissionRequirement>()
                .Select(r => {
                    var permission = permissions.FirstOrDefault(x => x.Name == r.PermissionName);
                    var groupName = permissionsGroup.FirstOrDefault(x => x.Name == (permission.Parent?.Name ?? permission.Name))?.DisplayName.Localize(_localizerFactory) ?? "";
                    var permissionName = permission?.DisplayName.Localize(_localizerFactory) ?? permission?.Name;
                    var combinedName = $"{groupName} > {permissionName}";
                    return (groupName, permissionName, combinedName);
                })
                .ToList();
            var allPermissionDetails = string.Join(",", requiredPermissions.Select(p => localizer["MSG_NoPermission", p.permissionName, p.groupName].Value));
            var errorDetail = ErrorDetailHelper.GetErrorDetail(allPermissionDetails, AbpAuthorizationErrorCodes.GivenPolicyHasNotGranted);
            var allCombinedNames = string.Join(", ", requiredPermissions.Select(p => p.combinedName));
            var response = new
            {
                error = new
                {
                    code = "403",
                    message = localizer["ERROR_NoPermission", allCombinedNames].Value,
                    details = errorDetail,
                    data = errorDetail,
                }
            };
            context.Response.StatusCode = StatusCodes.Status403Forbidden;
            context.Response.ContentType = "application/json";
            await context.Response.WriteAsync(JsonSerializer.Serialize(response));
            return;
        }
        await _defaultHandler.HandleAsync(next, context, policy, authorizeResult);
    }
}