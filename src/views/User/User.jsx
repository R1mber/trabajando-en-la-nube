import React from 'react'
import { Header } from '../../components'
import { storage, db, auth } from './../../config/firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { collection, doc, getDoc, getDocs, setDoc, updateDoc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

export default function User () {
  const [user, setUser] = React.useState(null)
  const [load, setLoad] = React.useState(false)
  const [products, setProducts] = React.useState([])
  const history = useNavigate()

  const logout = () => {
    auth.signOut()
    history('/login')
    console.log('cerrar sesion')
  }

  React.useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoad(true)
      } else {
        setLoad(true)
      }
    })
  })

  React.useEffect(() => {
    if (load) {
      getUser()
    }
  }, [load])

  React.useEffect(() => {
    if (user) {
      loadProducts()
    }
  }, [user])

  const getUser = async () => {
    const user = auth.currentUser.uid
    const userRef = doc(db, 'users', user)
    const userDoc = await getDoc(userRef)

    if (userDoc.exists()) {
      console.log('User data:', userDoc.data())
      setUser(userDoc.data())
    } else {
      console.error('No such document!')
    }
  }

  const loadProducts = async () => {
    if (user) {
      const productsCollection = collection(db, 'users', user.uid, 'products')
      const productsSnapshot = await getDocs(productsCollection)
      const productsList = productsSnapshot.docs.map(doc => {
        return { ...doc.data(), id: doc.id }
      }
      )
      console.log('productsList:', productsList)
      setProducts(productsList)
    } else {
      console.error('No user is signed in')
    }
  }

  const addProduct = async (e) => {
    e.preventDefault()
    const image = document.getElementById('image').files[0]
    const name = document.getElementById('name').value
    const description = document.getElementById('description').value
    const price = document.getElementById('price').value
    const object = document.getElementById('object').value

    if (!image) {
      console.error('No image selected')
      return
    }

    try {
      if (!user) {
        console.error('No user is signed in')
        return
      }

      const storageRef = ref(storage, `images/${image.name}`)
      const snapshot = await uploadBytes(storageRef, image)
      console.log('Uploaded a blob or file!', snapshot)

      const url = await getDownloadURL(storageRef)
      console.log('url', url)

      const newProductRef = doc(collection(db, 'products'))
      const productId = newProductRef.id

      const productData = {
        name,
        description,
        price,
        imageUrl: url,
        userId: user.uid,
        status: 1,
        object
      }

      await setDoc(newProductRef, productData)

      const userProductRef = doc(collection(db, 'users', user.uid, 'products'), productId)
      await setDoc(userProductRef, productData)

      setProducts([])
      loadProducts()

      console.log('Producto agregado exitosamente')
      alert('Producto agregado exitosamente')
      e.target.reset()
    } catch (error) {
      alert('Error al agregar producto')
      console.error('Error al agregar producto:', error)
    }
  }

  const alterProduct = async (productId, newStatus) => {
    try {
      const productRef = doc(db, 'products', productId)
      await updateDoc(productRef, { status: newStatus })

      const userProductRef = doc(db, 'users', user.uid, 'products', productId)
      await updateDoc(userProductRef, { status: newStatus })

      console.log('Producto actualizado exitosamente')
      alert('Producto actualizado exitosamente')
      setProducts([])
      loadProducts()
    } catch (error) {
      console.error('Error al actualizar producto:', error)
      alert('Error al actualizar producto')
    }
  }

  return (
    <>
      <Header />
      <div className='body-user'>
        <div className='content user-info'>
          <div className='details-content'>
            <h1>Información del usuario</h1>
            <p style={{
              fontSize: 12,
              fontWeight: 'bold',
              color: '#1d1d1d'
            }} >Código Usuario:</p>
            <p
              style={{
                fontSize: 10,
                color: '#1d1d1d'
              }}
            >{auth?.currentUser?.uid}</p>
            <p className='fw'>Nombre:</p>
            <p>{user?.name}</p>
            <p className='fw'>Correo:</p>
            <p>{user?.email}</p>
            <p className='fw'>Productos Publicados:</p>
            <p>{products.length}</p>
            <button
              style={{
                marginTop: 16
              }}
              onClick={() => logout()}
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
        <div className='content details'>
          {
            products.length > 0
              ? (
                <div className='details-content'>
                  <h1>Mis Productos</h1>
                  <div className='list-product'>
                    {products.map(product => (
                      <div className='card-product' key={product.id}>
                        <img src={product.imageUrl} alt={product.name} />
                        <div className='card-body'>
                          <h2 className='card-title'>{product.name}</h2>
                          <p style={{ fontSize: 12 }}>Cod. {product.id}</p>
                          <p className='card-description' >{product.description}</p>
                          <p className='card-stock'> Cantidad: {product.price}</p>
                          {
                            product.status === 2
                              ? (
                                <p className='card-sold'>Vendido</p>
                              )
                              : <div className='card-footer'>
                                {
                                  product.status === 1 && (
                                    <button className='btn btn-warning'
                                      onClick={() => alterProduct(product.id, 0)}
                                    >Ocultar</button>
                                  )
                                }
                                {
                                  product.status === 0 && (
                                    <button className='btn btn-success'
                                      onClick={() => alterProduct(product.id, 1)}
                                    >Publicar</button>
                                  )
                                }
                                <button className='btn btn-primary'
                                  onClick={() => alterProduct(product.id, 2)}
                                >Vender</button>
                              </div>
                          }
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
              : (
                <div className='details-content'>
                  <h1>Mis Productos</h1>
                  <p>No tienes productos publicados</p>
                </div>
              )}
        </div>
        <div className='content details add-product'>
          <h1>Agregar Producto</h1>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              addProduct(e)
            }}
          >
            <div className='form-group'>
              <label htmlFor='name'>Imagen</label>
              <input type='file' id='image' name='image' required />
            </div>
            <div className='form-group'>
              <label htmlFor='name'>Nombre</label>
              <input type='text' id='name' name='name' required />
            </div>
            <div className='form-group'>
              <label htmlFor='description'>Descripción</label>
              <textarea id='description' name='description' required />
            </div>
            <div className='form-group'>
              <label htmlFor='price'>Cantidad</label>
              <input type='number' id='price' name='price' required />
            </div>
            <div className='form-group'>
              <label htmlFor='price'>Objeto de cambio</label>
              <input id='object' name='object' required />
            </div>
            <button type='submit'>Agregar</button>
          </form>
        </div>
      </div>
    </>
  )
}
