import React from 'react'
import { useState, useEffect } from 'react'
import { collection, addDoc, doc, getDocs, getFirestore,query, where, onSnapshot,orderBy} from 'firebase/firestore'
import { storage, db, auth } from './../../config/firebase'
import { Header } from '../../components'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

export default function Chat() {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    const getChat = () => {
      
      const q = query(collection(db, "chat"), orderBy("fecha", "asc"));
      
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const messagesArray = [];
        querySnapshot.forEach((doc) => {
          messagesArray.push({ id: doc.id, ...doc.data() });
          const cuerpo = document.getElementById('cuerpo')
          cuerpo.scrollTop=cuerpo.scrollHeight
        });
        setMessages(messagesArray);
      }, (error) => {
        console.error("Error al escuchar los cambios: ", error);

      });
      
      return unsubscribe;
    };


    const unsubscribeChat = getChat();

    const getUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const usersArray = [];
      querySnapshot.forEach((doc) => {
        usersArray.push({ id: doc.id, ...doc.data() });
        
      });
      setContacts(usersArray);
    };


    getUsers();

    return () => {
      unsubscribeAuth();
      unsubscribeChat();
    };
  }, []);

  const handleGuardar = async (e) => {
    const mensajes = document.getElementById('mensaje').value;
    try {
      const docRef = await addDoc(collection(db, "chat"), {
        mensaje: mensajes,
        fecha: Date.now(),
        uid: auth?.currentUser?.uid
      });
      
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    document.getElementById('mensaje').value = '';
    
  };

  return (
    <>
      <Header />
      <div className='prin'>
        <div className='contenido' id='contenido'>
          <div id='cabeza'> {auth?.currentUser?.displayName}</div>
          <div id='cuerpo'>
            {messages.map((message) => (
              <div key={message.id} style={{ 
                textAlign: message.uid === user?.uid ? 'right' : 'left',
                backgroundColor: message.uid === user?.uid ? '#DCF8C6' : 'rgb(233, 197, 197)',
                borderRadius: '10px',
                margin: '5px',
                padding: '10px',
                maxWidth: '60%',
                alignSelf: message.uid === user?.uid ? 'flex-end' : 'flex-start'
              }}>
                <samp>{message.mensaje}</samp> 
              </div>
            ))}
          </div>
          <div id='cuadrotexto'>
            <input type="text" id='mensaje' />
            <button id='btnenciar' onClick={handleGuardar}>enviar</button>
          </div>
        </div>
        <div id='contactos'>
          <h2>Contactos</h2>
          <ul>
            {contacts.map((contact) => (
              <li key={contact.id}>{contact.displayName}</li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}