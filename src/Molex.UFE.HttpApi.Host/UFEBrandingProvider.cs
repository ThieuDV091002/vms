using Volo.Abp.DependencyInjection;
using Volo.Abp.Ui.Branding;

namespace Molex.UFE;

[Dependency(ReplaceServices = true)]
public class UFEBrandingProvider : DefaultBrandingProvider
{
    public override string AppName => "UFE";
}
