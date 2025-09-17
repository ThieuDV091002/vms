using System;

namespace Molex.UFE.Dtos.Tenant;

public class CreateUpdateTenantModelingDto
{
    public string Name { get; set; }
    public DateTime? CreationTime { get; set; }
    public DateTime? LastModificationTime { get; set; }
}