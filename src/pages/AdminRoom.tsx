import { useParams, useHistory } from 'react-router-dom';
import { Fragment } from 'react';

import Modal from 'react-modal';

import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';

import { Button } from '../components/Button';
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';
// import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';

import { database } from '../services/firebase';

import '../styles/room.scss';
import { useState } from 'react';

type RoomParams = {
  id: string; 
}

export function AdminRoom() {
  // const { user } = useAuth();
  const history = useHistory();
  const params = useParams<RoomParams>();
  const roomId = params.id;

  const [questionIdModalOpen, setQuestionIdModalOpen] = useState<string | undefined>();

  const { title, questions } = useRoom(roomId);

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    })

    history.push('/');
  }

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm('Tem certeza que deseja excluir esta pergunta')) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
    }
  }

  async function handleCheckQuestionAnswered(questionId: string) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
        isAnswered: true,
      })
    }

  async function handleHighligthQuestion(questionId: string) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
        isHighlighted: true,
      })
    }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={ logoImg } alt="Letmeask" />
          <div>
            <RoomCode code={ roomId } />
            <Button isOutlined onClick={ handleEndRoom }>Encerrar sala</Button> 
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala { title }</h1>
          { questions.length > 0 && <span>{ questions.length } perguntas</span> }
        </div>
        <div className="question-list">
          { questions.map(question => {
            return (
              <Fragment key={ question.id }>
              <Question
                content={ question.content }
                author={ question.author }
                isAnswered={ question.isAnswered }
                isHighlighted={ question.isHighlighted }
              >
                <button
                  type="button"
                  onClick={() => handleCheckQuestionAnswered(question.id)}
                >
                  <img src={ checkImg } alt="Marcar pergunta como respondida" />
                </button>
                <button
                  type="button"
                  onClick={() => handleHighligthQuestion(question.id)}
                >
                  <img src={ answerImg } alt="Dar destaque a pergunta" />
                </button>
                <button
                  type="button"
                  onClick={() => setQuestionIdModalOpen(question.id)}
                >
                  <img src={ deleteImg } alt="Remover pergunta" />
                </button>
              </Question>

              <Modal 
              isOpen={ questionIdModalOpen === question.id }
              onRequestClose= {() => setQuestionIdModalOpen(undefined)}
            >
              <button onClick={() => handleDeleteQuestion(question.id)}>Deletar</button>
              <button onClick= {() => setQuestionIdModalOpen(undefined)}>Fechar</button>
            </Modal>
            </Fragment>
            );
          }) }
        </div>        
      </main>
    </div>    
  );
}  