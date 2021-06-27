import { useHistory } from 'react-router-dom';
// import { FormEvent } from 'react';
import { useForm } from 'react-hook-form';
import{ yupResolver } from '@hookform/resolvers/yup';

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/google-icon.svg';
// import sunImg from '../assets/images/sun.svg';

import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth';

import '../styles/auth.scss';
// import { useState } from 'react';
// import { database } from '../services/firebase';
import { useTheme } from '../hooks/useTheme';
import * as Yup from 'yup';

const schema = Yup.object().shape({
  roomCode: Yup.string().required('Código obrigatório').min(6, '6 caracteres no mínimo')
})

export function Home() {
  const history = useHistory();
  const { user, sigInWithGoogle } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(schema), 
  });
  console.log(formState.errors)
  async function handleCreateRoom() {
    if (!user) {
      await sigInWithGoogle();
    }
    
    history.push('/rooms/new');
  }

  async function handleJoinRoom(data: any) {
    console.log(data)

    // event.preventDefault();

    // if (roomCode.trim() === '') {
    //   return;
    // }

    // const roomRef = await database.ref(`rooms/${roomCode}`).get();

    // if (!roomRef.exists()) {
    //   alert('Room does not exists.');
    //   return;
    // }

    // if (roomRef.val().endedAt) {
    //   alert('Room already closed.');
    //   return;
    // }

    // history.push(`/rooms/${roomCode}`);
  }

  return (
    <div id="page-auth" className={ theme }> 
      <aside>
        <img src={ illustrationImg } alt="Illustração simbolizando perguntas e respostas" />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvidas de sua audiência em tempo real</p>
      </aside>
      <main>
        <div className="main-content">
        {/* <h1>{ theme }</h1> */}
        {/* <button onClick={ toggleTheme }>Toggle</button> */}
        <div className="container">
          <label className="switch">
            <input onClick={ toggleTheme }type="checkbox" />    
            <div></div>
          </label>
        </div>

        <div className="logo-backgrond">
          <img src={ logoImg } alt="Letmeask" />
        </div>
        <button onClick={ handleCreateRoom } className="create-room">
          <img src={ googleIconImg } alt="Logo do Google" />
          Crie sua sala com a Google
        </button>
        <div className="separator">Ou entre em uma sala</div>
        <form onSubmit={ handleSubmit(handleJoinRoom) }>
          <input 
            type="text" 
            placeholder="Dígite o código da sala"
            { ...register('roomCode') }
          />
          <Button type="submit">
            Entre na sala
          </Button>
        </form>
        </div>
      </main>
    </div>
  );
}

// function userAuth(): { user: any; sigInWithGoogle: any; } {
//   throw new Error('Function not implemented.');
// }
