import { useState } from 'react'
import './style.css'

import { Link } from 'react-router-dom'

import { auth } from '../../firebaseconnection'
import { signInWithEmailAndPassword } from 'firebase/auth'

import { useNavigate } from 'react-router-dom'

export default function Home() {
  const [email, setEmail] = useState('')
  const [password, setpassword] = useState('')

  const navigate = useNavigate();


  async function handleLogin(e) {
    e.preventDefault();

    if (email !== '' && password !== '') {

      await signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          //navegar para /admin
          navigate('/admin', { replace: true })
        })
        .catch(() => {
          console.log("ERRO AO FAZER O LOGIN")
        })

    } else {
      alert("Preencha todos os campos!")
    }

  }

  return (
    <div className='home-container'>
      <h1>Lista de Tarefas</h1>
      <span>Gerencie sua agenda de forma fácil.</span>

      <form className='form' onSubmit={handleLogin}>
        <input
          type="text"
          placeholder='Digite se email...'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input

          type="password"
          placeholder='*****'
          value={password}
          onChange={(e) => setpassword(e.target.value)}
        />

        <button type="submit">Acessar</button>


      </form>

      <Link className='button-link' to='/register'>
        Não possui uma conta? Cadastra-se
      </Link>
    </div>
  )
}

