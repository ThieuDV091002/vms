using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public class ApiPermissionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly List<ApiPermissionConfig> _permissions;
    private readonly IAuthorizationService _authorizationService;

    public ApiPermissionMiddleware(RequestDelegate next, IConfiguration configuration, IAuthorizationService authorizationService)
    {
        _next = next;
        _authorizationService = authorizationService;
        _permissions = configuration.GetSection("ApiPermissions").Get<List<ApiPermissionConfig>>() ?? new();
        DefinePermissions();
    }
    private void  DefinePermissions()
    {
        _permissions.Add(new ApiPermissionConfig
        {
            Path = "/api/identity/users",
            RequiredRole = "Admin"
        });
        _permissions.Add(new ApiPermissionConfig
        {
            Path = "/api/identity/users",
            RequiredRole = "Admin"
        });
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var path = context.Request.Path.Value;
        var rule = _permissions.FirstOrDefault(p => path.StartsWith(p.Path, System.StringComparison.OrdinalIgnoreCase));
        if (rule != null)
        {
            if (!string.IsNullOrEmpty(rule.RequiredPolicy))
            {
                var authorized = await _authorizationService.AuthorizeAsync(context.User, null, rule.RequiredPolicy);
                if (!authorized.Succeeded)
                {
                    context.Response.StatusCode = 403;
                    await context.Response.WriteAsync("Forbidden: Policy required.");
                    return;
                }
            }
            if (!string.IsNullOrEmpty(rule.RequiredRole) && !context.User.IsInRole(rule.RequiredRole))
            {
                context.Response.StatusCode = 403;
                await context.Response.WriteAsync("Forbidden: Role required.");
                return;
            }
            if (!string.IsNullOrEmpty(rule.RequiredClaim) && !context.User.HasClaim(c => c.Type == rule.RequiredClaim))
            {
                context.Response.StatusCode = 403;
                await context.Response.WriteAsync("Forbidden: Claim required.");
                return;
            }
        }
        await _next(context);
    }
}

public class ApiPermissionConfig
{
    public string Path { get; set; }
    public string RequiredPolicy { get; set; }
    public string RequiredRole { get; set; }
    public string RequiredClaim { get; set; }
}