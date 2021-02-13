const validateCreateProduct = (values) => {
    let errors = {}

    // Validate name
    if(!values.name) {
        errors.name = "The name is mandatory"
    }

    // Validate company
    if(!values.company) {
        errors.company = "The company's name is mandatory"
    }

    // Validate url
    if(!values.url) {
        errors.url = "The product's url name is mandatory"
    } else if(!/^(ftp|http|https):\/\/[^ "]+$/.test(values.url)) {
        errors.url = "Not a valid URL"
    }

    // Validate description
    if(!values.description) {
        errors.description = "The product's description is mandatory"
    }

    return errors
}

export default validateCreateProduct