import { useState } from 'react';
import { db } from './firebaseconnection';
import {doc, setDoc, collection, addDoc, getDoc} from 'firebase/firestore';

import './app.css';
import { async } from '@firebase/util';

function App() {
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');

 async function handleAdd (){
//   await setDoc(doc(db, "posts", "12345"), {      //o setDoc tem que especificar o documento no caso o id 12345
//     titulo: titulo,
//     autor: autor,
//   })                                      //Código para gerar um id de forma manual, no caso eu coloquei o id 12345 
//   .then(()=> {
//     console.log("DADOS REGISTRADO NO BANCO!")
//   })
//   .catch((error)=>{
//     console.log("GEROU ERRO" + error)
//   })
    await addDoc(collection(db, "posts"), {         //o addDoc diferente do setDoc ele gera um id unico 
      titulo: titulo,
      autor: autor,
    })
    .then(()=>{
      console.log("DADOS REGISTRADO")
      setAutor("");
      setTitulo("");
    })
    .catch((error)=>{
      console.log("ERRO" + error)
    })
  }

  async function buscarPost(){
    
    const postRef = doc(db, "posts", "PbIcNz5rbF6VDdRcp88S")

    await getDoc(postRef)                    //o getDoc busca o post especifico nesse caso em busquei a id PbIcNz5rbF6VDdRcp88S
    .then((snapshot)=>{
      setAutor(snapshot.data().autor)
      setTitulo(snapshot.data().titulo)
    } )
    .catch(()=>{
      console.log("ERRO AO BUSCAR")
    })
  }
  

  return (
    <div>
      <h1>ReactJS + Firebase :) </h1>

      <div className='container'>
        <label>Titulo:</label>
        <textarea type="text" placeholder='Digite o titulo' value={titulo}  onChange={(e)=>setTitulo (e.target.value) }/>
        <label>Autor:</label>
        <input type="text" placeholder='Autor do post' value={autor}  onChange={(e)=> setAutor (e.target.value)}/>
        <button onClick={handleAdd}>Cadastrar</button>
        <button onClick={buscarPost}>Buscar Post</button>
      </div>

    </div>
  );
}

export default App;
