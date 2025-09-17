export interface KochUserInfo {
    resources: KochUserInfoResource[]
    totalResults: number
    count: number
    cookie: string
}
export interface KochUserInfoResource {
    dn: string
    attributes: KochUserInfoResourceAttribute
}
export interface KochUserInfoResourceAttribute {
    mail: string
    employeeID: string
    givenName: string
    sAMAccountName: string
    sn: string
    mobile: string
}