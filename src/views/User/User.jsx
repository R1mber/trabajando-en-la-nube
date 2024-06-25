import React from 'react'
import { Header } from '../../components'
import { storage, db, auth } from './../../config/firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { collection, addDoc, doc, getDoc } from 'firebase/firestore'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

export default function User () {
 const [user, setUser] = React.useState(null)
 const [load, setLoad] = React.useState(false)
  const logout = () => {
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

  const addProduct = async (e) => {
    e.preventDefault()
    const image = document.getElementById('image').files[0]
    const name = document.getElementById('name').value
    const description = document.getElementById('description').value
    const price = document.getElementById('price').value

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

      const productsCollection = collection(db, 'products')
      await addDoc(productsCollection, {
        name,
        description,
        price,
        imageUrl: url,
        userId: user.uid, // Agregar el ID del usuario
        status: 'active'
      })

      const userProduct = collection(db, 'users', user.uid, 'products')
      await addDoc(userProduct, {
        name,
        description,
        price,
        imageUrl: url,
        status: 'active'
      })

      console.log('Producto agregado exitosamente')
      alert('Producto agregado exitosamente')
      e.target.reset()
    } catch (error) {
      alert('Error al agregar producto')
      console.error('Error al agregar producto:', error)
    }
  }

  return (
    <>
      <Header />
      <div className='body-user'>
        <div className='content user-info'>
          <div className='details-content'>
            <h1>Información del usuario</h1>
            <p>Código Usuario:</p>
            <p>{auth?.currentUser?.uid}</p>
            <p>Nombre: </p>
            <p>Correo: </p>
            <p>Productos Publicados: </p>
            <button
              onClick={() => logout()}
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
        <div className='content details'>a</div>
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
            <button type='submit'>Agregar</button>
          </form>
        </div>
      </div>
    </>
  )
}
