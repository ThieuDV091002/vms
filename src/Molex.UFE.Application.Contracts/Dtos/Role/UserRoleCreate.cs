using System;

namespace Molex.UFE.Dtos.Role;

public class UserRoleCreate
{
    public Guid UserId { get; set; }
    public Guid RoleId { get; set; }
    public Guid? TenantId { get; set; }
}