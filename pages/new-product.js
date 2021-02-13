import React, {useState, useContext} from "react"
import {css} from "@emotion/react"
import Layout from "../components/layout/Layout"
import {Form, Field, InputSubmit, Error} from "../components/ui/Form"
import {FirebaseContext} from "../firebase"
import Router, {useRouter} from "next/router"
// Validation
import useValidation from "../hooks/useValidation"
import validateCreateProduct from "../validation/validateCreateProduct"
import Error404 from "../components/layout/404"


const INITIAL_STATE = {
  name: "",
  company: "",
  url: "",
  description: ""
}


const NewProduct = () => {

  const [error, setError] = useState(false)
  const [image, setImage] = useState(null)

  const {values, errors, handleSubmit, handleChange, handleBlur} = useValidation(INITIAL_STATE, validateCreateProduct, createProduct)

  const {name, company, url, description} = values

  // Routing hook
  const router = useRouter()

  const {user, firebase} = useContext(FirebaseContext)

  const handleFile = e => {
    if(e.target.files[0]){
      console.log(e.target.files[0])
      setImage(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    const uploadTask = await firebase.storage.ref(`products/${image.lastModified}${image.name}`).put(image)
    const downloadURL = await uploadTask.ref.getDownloadURL()
    return downloadURL
  }

  async function createProduct() {
    if(!user) {
      return router.push("/login")
    }

    // Create new Product Object
    const product = {
      name,
      company,
      url,
      imageUrl: await handleUpload(),
      description,
      votes: 0,
      comments: [],
      created: Date.now(),
      creator: {
        id: user.uid,
        name: user.displayName
      },
      voted: []
    }

    // Add to Data Base
    await firebase.db.collection("products").add(product)

    return router.push("/")
  }

  return (
    <div>
      <Layout>
        {!user ? <Error404 /> : (
          <>
            <h1
              css={css`
                text-align: center;
                margin-top: 5rem;
              `}
            >New Product</h1>
            <Form
              onSubmit={handleSubmit}
              noValidate
            >

              <fieldset>
                <legend>General Information</legend>
              
                <Field>
                  <label htmlFor="name">Name</label>
                  <input
                    id="name" 
                    type="text"
                    placeholder="Product's Name"
                    name="name"
                    value={name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Field>

                {errors.name && <Error>{errors.name}</Error>}

                <Field>
                  <label htmlFor="company">Company</label>
                  <input
                    id="company" 
                    type="text"
                    placeholder="Company"
                    name="company"
                    value={company}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Field>

                {errors.company && <Error>{errors.company}</Error>}

                <Field>
                  <label htmlFor="image">Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    id="image" 
                    name="image"
                    onInput={(e) => handleFile(e)}
                  />
                </Field>

                <Field>
                  <label htmlFor="url">URL</label>
                  <input
                    id="url" 
                    type="url"
                    placeholder="Product's URL"
                    name="url"
                    value={url}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Field>

                {errors.url && <Error>{errors.url}</Error>}

              </fieldset>
              <fieldset>
                <legend>About Your Product</legend>

                <Field>
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description" 
                    name="description"
                    value={description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Field>

                {errors.description && <Error>{errors.description}</Error>}


              </fieldset>

              {error && <Error>{error}</Error>}

              <InputSubmit 
                type="submit"
                value="Create Product"  
              />
            </Form>
          </>
        )}
      </Layout>
    </div>
  )

}

export default NewProduct