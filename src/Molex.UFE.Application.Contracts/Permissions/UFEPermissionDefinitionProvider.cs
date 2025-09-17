using JetBrains.Annotations;
using Microsoft.Extensions.DependencyInjection;
using Molex.UFE.Localization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Nodes;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Features;
using Volo.Abp.GlobalFeatures;
using Volo.Abp.Localization;
using Volo.Abp.SimpleStateChecking;
using Volo.Abp.Users;
using static Molex.UFE.Permissions.UFEPermissions;

namespace Molex.UFE.Permissions;

public class UFEPermissionDefinitionProvider : PermissionDefinitionProvider
{
    private readonly IAbpLazyServiceProvider _lazyServiceProvider;
    public UFEPermissionDefinitionProvider(IAbpLazyServiceProvider lazyServiceProvider)
    {
        _lazyServiceProvider = lazyServiceProvider;
    }
    public override void Define(IPermissionDefinitionContext context)
    {
        //demo Please add RequiredApplication(VMS) for all VMS permissions
        //var DemoGroup = context.AddGroup("Demo", L("Demo"));
        //var demoPermission = DemoGroup.AddPermission("Demo", L("View")).RequireApplication("VMS");



    }

    private static LocalizableString L(string name)
    {
        return LocalizableString.Create<UFEResource>(name);
    }
}

