namespace Molex.UFE;

public static class UFEDomainErrorCodes
{
    /* You can add your business exception error codes here, as constants */
    /*The naming format for error codes in the code repository is as follows:
        ufe-glb-svc——1xxx
        ufe-corporate-svc——2xxx
        ufe-dashboard-svc——3xxx
        ufe-tenantpermission-svc——4xxx
        ufe-ticket-svc——5xxx
        ufe-notification-svc——6xxx
        ufe-scheduler-svc——7xxx*/

    public const string InternalServerError = "500";
    public const string ModelingAlreadyExisted = "3001";
    public const string ModelingRequiredDataIsNull = "3002";
    public const string FileNotExisted = "3003";
    public const string NotExisted = "3004";
    public const string DisplayNameAlreadyExisted = "3005";
    public const string SubMenuIsNotExisted = "3006";
    public const string RoleIsNotExisted = "3007";
    public const string IMPORTUSERERROR = "3008";
    public const string ChildEntityExists = "3009";  
    public const string TextTemplateIsNotExisted = "3010";  

}
