using Volo.Abp.Settings;

namespace Molex.UFE.Settings;

public class UFESettingDefinitionProvider : SettingDefinitionProvider
{
    public override void Define(ISettingDefinitionContext context)
    {
        //Define your own settings here. Example:
        //context.Add(new SettingDefinition(UFESettings.MySetting1));
    }
}
