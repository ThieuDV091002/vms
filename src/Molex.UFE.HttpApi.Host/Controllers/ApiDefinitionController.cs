

using Microsoft.AspNetCore.Mvc;
using Volo.Abp;
using Volo.Abp.AspNetCore.Controllers;
using Volo.Abp.AspNetCore.Mvc.ApiExploring;
using Volo.Abp.Http.Modeling;

namespace Molex.UFE.Controllers
{

    [Area("abp")]
    [RemoteService(Name = "abp")]
    [ReplaceControllers(typeof(AbpApiDefinitionController))]

    public class ApiDefinitionController : AbpApiDefinitionController
    {
        public ApiDefinitionController(IApiDescriptionModelProvider modelProvider) : base(modelProvider)
        {
        }

        public override ApplicationApiDescriptionModel Get(ApplicationApiDescriptionModelRequestDto model)
        {
            var apis = base.Get(model);
            foreach (var item in apis.Modules)
            {
                item.Value.RemoteServiceName = "qms";
            }


            return apis;
        }
    }
}
