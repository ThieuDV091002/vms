using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Nodes;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Features;
using Volo.Abp.SimpleStateChecking;
using Volo.Abp.Users;

namespace Molex.UFE
{
    public static class PermissionDefinitionExtensions
    {
        public static TState RequireApplication<TState>(this TState state, string applicationName) where TState : IHasSimpleStateCheckers<TState>
        {
            state.StateCheckers.Add(new RequireApplicationSimpleStateChecker<TState>(applicationName));
            return state;
        }
    }

    public class RequireApplicationSimpleStateChecker<TState> : ISimpleStateChecker<TState> where TState : IHasSimpleStateCheckers<TState>
    {
        public string Application { get; }
        public RequireApplicationSimpleStateChecker(string application)
        {
            Application = application;
        }
        public Task<bool> IsEnabledAsync(SimpleStateCheckerContext<TState> context)
        {
            var user = context.ServiceProvider.GetRequiredService<ICurrentUser>();
            var c = user.FindClaim("client_id")!.Value ?? "";
            return Task.FromResult(c.Contains(Application!.ToString()));
        }
    }


    public class ApplicationSimpleStateCheckerSerializerContributor :
        ISimpleStateCheckerSerializerContributor,
        ISingletonDependency
    {
        public const string CheckerShortName = "App";

        public string? SerializeToJson<TState>(ISimpleStateChecker<TState> checker)
            where TState : IHasSimpleStateCheckers<TState>
        {
            if (checker is not RequireApplicationSimpleStateChecker<TState> appSimpleStateChecker)
            {
                return null;
            }

            var jsonObject = new JsonObject
            {
                ["T"] = CheckerShortName,
                ["N"] = appSimpleStateChecker.Application
            };
            return jsonObject.ToJsonString();
        }

        public ISimpleStateChecker<TState>? Deserialize<TState>(JsonObject jsonObject, TState state)
            where TState : IHasSimpleStateCheckers<TState>
        {
            if (jsonObject["T"]?.ToString() != CheckerShortName)
            {
                return null;
            }

            var app = jsonObject["N"]?.ToString();
            return new RequireApplicationSimpleStateChecker<TState>(app);
        }
    }
}
