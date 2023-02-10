import { useState, useEffect } from 'react';
import { db, auth } from './firebaseconnection';
import { doc, setDoc, collection, addDoc, getDoc, getDocs, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'

import './app.css';
import { async } from '@firebase/util';

function App() {
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [idPost, setIdPost] = useState('');

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const [user, setUser] = useState(false);
  const [userDatail, setUserDatail] = useState({});


  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function loadPosts() {
      const unsub = onSnapshot(collection(db, "posts"), (onSnapshot) => {
        let listaPost = [];

        onSnapshot.forEach((doc) => {
          listaPost.push({
            id: doc.id,                           //Essa função onSnapshot fica em tempo real verificando se tem att no banco e ja atualiza na tela 
            titulo: doc.data().titulo,
            autor: doc.data().autor,
          })
        })

        setPosts(listaPost);
      })
    }
    loadPosts();
  }, [])

  useEffect(() => {
    async function checkLogin() {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          // se tem usuario logado ele entra aqui...
          console.log(user);
          setUser(true);
          setUserDatail({                  // função onAuthStateChanged deixa o usuario conectado após o login msm dando um f5 
            uid: user.uid, 
            email: user.email
          })

        } else {
          // nao possui nenhum user logado...
          setUser(false);
          setUserDatail({})
        }
      })
    }
    checkLogin();
  }, [])

  async function handleAdd() {
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
    await addDoc(collection(db, "posts"), {         //o addDoc diferente do setDoc ele gera um id unico pelo proprio firebase
      titulo: titulo,
      autor: autor,
    })
      .then(() => {
        console.log("DADOS REGISTRADO")
        setAutor("");
        setTitulo("");
      })
      .catch((error) => {
        console.log("ERRO" + error)
      })
  }

  async function buscarPost() {

    // const postRef = doc(db, "posts", "PbIcNz5rbF6VDdRcp88S")

    // await getDoc(postRef)                    //o getDoc busca o post especifico nesse caso em busquei a id PbIcNz5rbF6VDdRcp88S
    // .then((snapshot)=>{
    //   setAutor(snapshot.data().autor)
    //   setTitulo(snapshot.data().titulo)
    // } )
    // .catch(()=>{
    //   console.log("ERRO AO BUSCAR")
    // })

    const postRef = collection(db, "posts")
    await getDocs(postRef)
      .then((snapshot) => {
        let lista = [];

        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor,
          })
        })

        setPosts(lista);
      })
      .catch(() => {
        console.log("DEU ALGUM ERRO AO BUSCAR")
      })
  }

  async function editarPost() {
    const docRef = doc(db, "posts", idPost)
    await updateDoc(docRef, {
      titulo: titulo,
      autor: autor
    })
      .then(() => {
        console.log("POST ATUALIZADO!")
        setIdPost('')
        setTitulo('')
        setAutor('')
      })
      .catch(() => {
        console.log("ERRO AO ATUALIZAR!")
      })
  }

  async function excluirPost(id) {
    const docRef = doc(db, "posts", id)
    await deleteDoc(docRef)
      .then(() => {
        alert("POST DELETADO COM SUCESSO!")
      })
  }

  async function novoUsuario() {
    await createUserWithEmailAndPassword(auth, email, senha)
      .then(() => {
        console.log("CADASTRADO COM SUCESSO!");
        setEmail('')
        setSenha('')
      })
      .catch((error) => {
        if (error.code === 'auth/weak-password') {
          alert('Senha muito fraca')
        } else if (error.code == 'auth/email-already-in-use') {
          alert("Email já existe!")
        }
      })
  }

  async function logarUsuario() {
    await signInWithEmailAndPassword(auth, email, senha)
      .then((value) => {
        console.log("USER LOGADO COM SUCESSO!");
        console.log(value.user);

        setUserDatail({
          uid: value.user.uid, email: value.user.email,
        })
        setUser(true);
        setEmail('');
        setSenha('');
      })
      .catch(() => {
        console.log("ERRO AO FAZER O LOGIN");
      })
  }
  async function fazerLogout() {
    await signOut(auth)
    setUser(false);
    setUserDatail({})
  }

  return (
    <div>
      <h1>ReactJS + Firebase :) </h1>

      {user && (
        <div>
          <strong>Seja bem-vindo(a) (Você está logado!)</strong> <br />
          <span>ID: {userDatail.uid} - Email: {userDatail.email}</span><br />
          <button onClick={fazerLogout}>Sair da conta </button>
          <br /><br />

        </div >
      )}


      <div className='container'>

        <h2>Usuários</h2>

        <label>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Digite seu email" /><br />
        <label>Senha</label>
        <input value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Digite sua senha" /><br />

        <button onClick={novoUsuario}>Cadastrar</button>
        <button onClick={logarUsuario}>Fazer Login</button>


      </div>

      <br /><br />
      <hr />

      <div className='container'>

        <h2>Posts</h2>

        <label>ID do Post</label>
        <input
          placeholder='Digite o ID do post que deseja atualizar' value={idPost} onChange={(e) => setIdPost(e.target.value)} /><br />

        <label>Titulo:</label>
        <textarea type="text" placeholder='Digite o titulo' value={titulo} onChange={(e) => setTitulo(e.target.value)} /><br />
        <label>Autor:</label>
        <input type="text" placeholder='Autor do post' value={autor} onChange={(e) => setAutor(e.target.value)} /><br />
        <button onClick={handleAdd}>Cadastrar</button><br />
        <button onClick={buscarPost}>Buscar Post</button> <br />
        <button onClick={editarPost}>Atualizar post</button>

        <ul>
          {posts.map((post) => {
            return (
              <li key={post.id}>
                <strong>ID: {post.id}</strong><br />
                <span> Titulo: {post.titulo}</span><br />
                <span> Autor: {post.autor}</span><br /><br />
                <button onClick={() => excluirPost(post.id)}>Excluir</button> <br /><br />
              </li>
            )
          })}
        </ul>
      </div>

    </div>
  )
}

export default App;
