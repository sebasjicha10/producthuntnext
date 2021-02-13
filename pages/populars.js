import React from "react"
import Layout from "../components/layout/Layout"
import ProductDetails from "../components/layout/ProductDetails"
import useProducts from "../hooks/useProducts"


const Populars = () => {

  const {products} = useProducts("votes")

  return(    
    <div>
      <Layout>
        <div className="products-list">
          <div className="container">
            <ul className="bg-white">
              {products.map(product => (
                <ProductDetails 
                  key={product.id}
                  product={product}
                />
              ))}
            </ul>
          </div>
        </div>
      </Layout>
    </div>
  )
}

export default Populars