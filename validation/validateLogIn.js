const validateLogIn = (values) => {
    let errors = {}

    // Validate email
    if(!values.email) {
        errors.email = "The email is mandatory"
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
        errors.email = "Not a valid email"
    }

    // Validate password
    if(!values.password) {
        errors.password = "The password is mandatory"
    } else if(values.password.length < 6) {
        errors.password = "The password must have at least 6 characters"
    }

    return errors
}

export default validateLogIn