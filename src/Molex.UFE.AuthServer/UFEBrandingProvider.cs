using Volo.Abp.Ui.Branding;
using Volo.Abp.DependencyInjection;

namespace Molex.UFE;

[Dependency(ReplaceServices = true)]
public class UFEBrandingProvider : DefaultBrandingProvider
{
    public override string AppName => "UFE";
}
