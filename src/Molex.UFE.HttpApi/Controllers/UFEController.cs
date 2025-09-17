using Molex.UFE.Localization;
using Volo.Abp.AspNetCore.Mvc;

namespace Molex.UFE.Controllers;

/* Inherit your controllers from this class.
 */
public abstract class UFEController : AbpControllerBase
{
    protected UFEController()
    {
        LocalizationResource = typeof(UFEResource);
    }
}
