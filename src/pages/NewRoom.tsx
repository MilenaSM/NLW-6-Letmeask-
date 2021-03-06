import { Link, useHistory } from 'react-router-dom';
import { FormEvent } from 'react';

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';

import { useState } from 'react';
import { database } from '../services/firebase';
import { useAuth } from '../hooks/useAuth';

import { Button } from '../components/Button';

import '../styles/auth.scss';
import { useTheme } from '../hooks/useTheme';


export function NewRoom() {
  const { user } = useAuth();
  const history = useHistory();
  const [newRoom, setNewRoom] = useState('');
  const { theme, toggleTheme } = useTheme();

  async function handleCreateRoom(event: FormEvent) {
    event.preventDefault();

    if (newRoom.trim() === '') {
      return;
    }

    const roomRef = database.ref('rooms');

    const firebaseRoom = await roomRef.push({
      title: newRoom,
      authorId: user?.id,
    })

    history.push(`/rooms/${firebaseRoom.key}`);
  }

  return (
    <div id="page-auth" className={ theme }> 
    <div className="container">
          <label className="switch">
            <input onClick={ toggleTheme }type="checkbox" />    
            <div></div>
          </label>
        </div>
    <aside>
      <img src={ illustrationImg } alt="Illustração simbolizando perguntas e respostas" />
      <strong>Crie salas de Q&amp;A ao-vivo</strong>
      <p>Tire as dúvidas de sua audiência em tempo real</p>
    </aside>
    <main>
      <div className="main-content">
      <div className="logo-backgrond">
        <img src={ logoImg }alt="Letmeask" />
      </div>
      <h2>Criar uma nova sala</h2>
      <form onSubmit={ handleCreateRoom }>
        <input 
          type="text" 
          placeholder="Nome da sala"
          onChange={event => setNewRoom(event.target.value)}
          value={ newRoom }
        />
        <Button type="submit">
          Criar sala
        </Button>
      </form>
      <p>Quer entrar em uma sala existente?  
        <Link to="/">
          clique aqui
        </Link>
      </p>
      </div>
    </main>
  </div>
  );
}