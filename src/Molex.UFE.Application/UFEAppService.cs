using System;
using System.Collections.Generic;
using System.Text;
using Molex.UFE.Localization;
using Volo.Abp.Application.Services;

namespace Molex.UFE;

/* Inherit your application services from this class.
 */
public abstract class UFEAppService : ApplicationService
{
    protected UFEAppService()
    {
        LocalizationResource = typeof(UFEResource);
    }
}
