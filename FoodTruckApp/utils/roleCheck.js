function roleCheck(userRoles) {
    let isAdmin = false
    let isCustomer = false
    let isManager = false
    let isStaff = false
    if (userRoles === 'Admin') {
        isAdmin = true
    } else if (userRoles === 'Customer') {
        isCustomer = true
    } else if (userRoles === 'Manager') {
        isManager = true
    } else if (userRoles === 'Staff') {
        isStaff = true
    } else if (userRoles === 'Admin-Customer') {
        isAdmin = true
        isCustomer = true
    } else if (userRoles === 'Manager-Customer') {
        isManager = true
        isCustomer = true
    } else if (userRoles === 'Staff-Customer') {
        isStaff = true
        isCustomer = true
    }
    return {
        admin: isAdmin,
        customer: isCustomer,
        manager: isManager,
        staff: isStaff
    }
}

module.exports = roleCheck