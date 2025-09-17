using System.Text.Json.Serialization;
using Volo.Abp.Data;

namespace Molex.UFE.Dtos.Role;

public class ExportRoleModelingDto
{
    public string Name { get; set; }
    
    public bool? IsDefault { get; set; }
    [JsonIgnore]
    public bool? IsPublic { get; set; }
    public string? MenuName { get; set; }
    public string[]? Permissions { get; set; }
}