import React from 'react'
import {css} from "@emotion/react"


const Error404 = () => {
    return (  
        <h1
            css={css`
                margin-top: 5rem;
                text-align: center;
            `}
        >Page doesn't exist or Authentication needed to access this page</h1>
    )
}
 
export default Error404