import { useHistory } from 'react-router-dom';
import { FormEvent } from 'react';

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/google-icon.svg';

import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth';

import '../styles/auth.scss';
import { useState } from 'react';
import { database } from '../services/firebase';
import { useTheme } from '../hooks/useTheme';

export function Home() {
  const history = useHistory();
  const { user, sigInWithGoogle } = useAuth();

  const { theme, toggleTheme } = useTheme();

  const [roomCode, setRoomCode] = useState('');

  async function handleCreateRoom () {
    if (!user) {
      await sigInWithGoogle();
    }
    
    history.push('/rooms/new');
  }

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault();

    if (roomCode.trim() === '') {
      return;
    }

    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    if (!roomRef.exists()) {
      alert('Room does not exists.');
      return;
    }

    if (roomRef.val().endedAt) {
      alert('Room already closed.');
      return;
    }

    history.push(`/rooms/${roomCode}`);
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
        <h1>{ theme }</h1>
        <button onClick={ toggleTheme }>Toggle</button>
        <img src={logoImg} alt="Letmeask" />
        <button onClick={ handleCreateRoom } className="create-room">
          <img src={ googleIconImg } alt="Logo do Google" />
          Crie sua sala com a Google
        </button>
        <div className="separator">Ou entre em uma sala</div>
        <form onSubmit={ handleJoinRoom }>
          <input 
            type="text" 
            placeholder="Dígite o código da sala"
            onChange={ event => setRoomCode(event.target.value) }
            value={ roomCode }
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