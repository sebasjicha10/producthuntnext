import React, {useEffect, useContext, useState} from 'react'
import {useRouter} from "next/router"
import Layout from "../../components/layout/Layout"
import {FirebaseContext} from "../../firebase"
import Error404 from "../../components/layout/404"
import {css} from "@emotion/react"
import styled from "@emotion/styled"
import formatDistanceToNow from "date-fns/formatDistanceToNow"
import {Field, InputSubmit} from "../../components/ui/Form"
import Button from "../../components/ui/Button"


const ProductContainer = styled.div`
    @media(min-width: 768px) {
        display: grid;
        grid-template-columns: 2fr 1fr;
        column-gap: 2rem;
    }
`

const ProductCreator = styled.p`
    padding: .5rem 2rem;
    background-color: #DA552F;
    color: #fff;
    text-transform: uppercase;
    font-weight: bold;
    display: inline-block;
    text-align: center;
`

const Loading = styled.div`
    margin-top: 20rem;
    background-color: #DA552F;
    color: #fff;
    display: block;
    text-align: center;
    font-size: 30px;
`

const Product = () => {

    const [product, setProduct] = useState({})
    const [error, setError] = useState(false)
    const [comment, setComment] = useState({})
    const [callDB, setCallDB] = useState(true)

    // Routing to get the current id
    const router = useRouter()
    const {query: {id}} = router

    // Firebase Context
    const {firebase, user} = useContext(FirebaseContext)

    useEffect(() => {
        if(id && callDB) {
            const getProduct = async () => {
                const productQuery = await firebase.db.collection("products").doc(id)
                const product = await productQuery.get()
                if(product.exists) {
                    setProduct(product.data())
                    setCallDB(false)
                } else {
                    setError(true)
                    setCallDB(false)
                }
            }
            getProduct()
        }
    }, [id])

    if(Object.keys(product).length === 0 && !error) return (<Loading>Loading...</Loading>)

    const {comments, created, description, company, name, url, imageUrl, votes, creator, voted} = product 

    // Manage and validate votes
    const voteProduct = () => {
        if(!user) {
            return router.push("/login")
        }

        // Get and add new vote
        const newTotal = votes + 1

        // Verify if user already voted
        if(voted.includes(user.uid)) return

        // Register user's id as voted
        const newVoted = [...voted, user.uid]
        
        // Update Data Base and State
        firebase.db.collection("products").doc(id).update({
            votes: newTotal, 
            voted: newVoted
        })

        setProduct({
            ...product,
            votes: newTotal
        })
        setCallDB(true)
    }

    // Comment handling
    const handleCommentChange = e => {
        setComment({
            ...comment,
            [e.target.name]: e.target.value
        })
        setCallDB(true)
    }

    const isCreator = id => {
        if(creator.id == id) {
            return true
        }
    }

    const addComment = e => {
        e.preventDefault()

        if(!user) {
            return router.push("/login")
        }

        comment.userId = user.uid
        comment.userName = user.displayName

        const newComments = [...comments, comment]

        // Update BD & State
        firebase.db.collection("products").doc(id).update({
            comments: newComments
        })

        setProduct({
            ...product,
            comments: newComments
        })

    }

    const canDelete = () => {
        if(!user) return false

        if(creator.id === user.uid) {
            return true
        }
    }

    const deleteProduct = async () => {

        if(!user) {
            return router.push("/login")
        }
        if(creator.id !== user.uid) {
            return router.push("/")
        }

        try {
            await firebase.db.collection("products").doc(id).delete()
            router.push("/")

        } catch (error) {
            console.log(error)
        }
    }
    
    return (  
        <Layout>
            <>
                {error ? <Error404 /> : (
                    <div className="container">
                        <h1
                            css={css`
                                text-align: center;
                                margin-top: 5rem;
                            `}
                        >{name}</h1>
                        
                        <ProductContainer>
                            <div>
                                <p>{created ? `Published ${formatDistanceToNow(new Date(created))} ago` : null}</p>
                                <p>{creator ? `by ${creator.name} from ${company}` : null}</p>
                                <img src={imageUrl} />
                                <p>{description}</p>

                                {user && (
                                    <>
                                        <h2>Add Comment</h2>
                                        <form
                                            onSubmit={addComment}
                                        >
                                            <Field>
                                                <input                                 
                                                    type="text"
                                                    name="message"
                                                    onChange={handleCommentChange}
                                                />
                                            </Field>
            
                                            <InputSubmit 
                                                type="submit"
                                                value="Add Comment"
                                            />
                                        </form>
                                    </>
                                )}

                                <h2
                                css={css`
                                    margin: 2rem 0;
                                `}
                                >Comments</h2>


                                {comments.length === 0 ? "No comments yet" : (
                                    <ul>
                                        {comments.map((comment, i) => (
                                            <li
                                                key={`${comment.userId}-${i}`}
                                                css={css`
                                                    border: 1px solid #e1e1e1;
                                                    padding: 2rem;
                                                `}
                                            >
                                                <p>{comment.message}</p>
                                                <p>By 
                                                    <span
                                                        css={css`
                                                            font-weight: bold;
                                                        `}
                                                    > {comment.userName}</span>
                                                </p>
                                                {isCreator(comment.userId) && 
                                                <ProductCreator>Creator</ProductCreator>}
                                            </li>
                                        ))}
                                    </ul>
                                )}

                            </div>

                            <aside>
                                <Button
                                    target="_blank"
                                    bgColor="true"
                                    href={url}
                                >Visit URL</Button>

                                <div
                                    css={css`
                                        margin-top: 5rem;
                                    `}
                                >
                                    <p
                                        css={css`
                                            text-align: center;
                                        `}
                                    >{votes} Votes</p>

                                    {user && (
                                        <Button
                                            onClick={voteProduct}
                                        >Vote</Button>
                                    )}
                                </div>
                            </aside>
                        </ProductContainer>
                        {canDelete() && 
                            <Button
                                onClick={deleteProduct}
                            >Delete Product</Button>
                        }
                    </div>
                )}
            </>
        </Layout>
    )
}
 
export default Product