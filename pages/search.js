import React, {useEffect, useState} from "react"
import Layout from "../components/layout/Layout"
import {useRouter} from "next/router"
import ProductDetails from "../components/layout/ProductDetails"
import useProducts from "../hooks/useProducts"


const Search = () => {

  const router = useRouter()
  const {query: {q}} = router

  // Filter all products
  const {products} = useProducts("created")
  const [result, setResult] = useState([])

  useEffect(() => {
    const search = q.toLowerCase()
    const filter = products.filter(product => {
      return (
        product.name.toLowerCase().includes(search) || 
        product.description.toLowerCase().includes(search)
      )
    })
    setResult(filter)
  }, [q, products])

  return (
    <div>
      <Layout>
        <div className="products-list">
          <div className="container">
            <ul className="bg-white">
              {result.map(product => (
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

export default Search