import React, {useState} from "react"
import {css} from "@emotion/react"
import Layout from "../components/layout/Layout"
import {Form, Field, InputSubmit, Error} from "../components/ui/Form"
import firebase from "../firebase"
import Router from "next/router"
// Validation
import useValidation from "../hooks/useValidation"
import validateSignUp from "../validation/validateSignUp"


const INITIAL_STATE = {
  name: "",
  email: "",
  password: ""
}

const Signup = () => {

  const [error, setError] = useState(false)

  const {values, errors, handleSubmit, handleChange, handleBlur} = useValidation(INITIAL_STATE, validateSignUp, signUp)

  const {name, email, password} = values

  async function signUp() {

    try {
      await firebase.register(name, email, password)
      Router.push("/")
    } catch (error) {
      console.error("Error when creating the user", error.message)
      setError(error.message)
    }

  }
    
  return (
    <div>
      <Layout>
        <>
          <h1
            css={css`
              text-align: center;
              margin-top: 5rem;
            `}
          >Sign up</h1>
          <Form
            onSubmit={handleSubmit}
            noValidate
          >
            <Field>
              <label htmlFor="name">Name</label>
              <input
                id="name" 
                type="text"
                placeholder="Your Name"
                name="name"
                value={name}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Field>

            {errors.name && <Error>{errors.name}</Error>}

            <Field>
              <label htmlFor="email">Email</label>
              <input
                id="email" 
                type="email"
                placeholder="Your Email"
                name="email"
                value={email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Field>

            {errors.email && <Error>{errors.email}</Error>}

            <Field>
              <label htmlFor="password">Password</label>
              <input
                id="password" 
                type="password"
                placeholder="Your Password"
                name="password"
                value={password}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Field>
            
            {errors.password && <Error>{errors.password}</Error>}

            {error && <Error>{error}</Error>}

            <InputSubmit 
              type="submit"
              value="Create Account"  
            />
          </Form>
        </>
      </Layout>
    </div>
  )

}

export default Signup