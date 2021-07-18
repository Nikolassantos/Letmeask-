import { useHistory, useParams } from 'react-router-dom';

import logoImg from '../../assets/images/logo.svg';

import '../../global/styles/room.scss';
import Button from '../../components/Button';
import RoomCode from '../../components/RoomCode';
// import useAuth from '../../global/hooks/useAuth';
import Question from '../../components/Question';
import useRoom from '../../global/hooks/useRoom';
import deleteImg from '../../assets/images/delete.svg';
import { database } from '../../services/firebase';

interface RoomParams {
  id: string;
}

function AdminRoom() {
  const params = useParams<RoomParams>();
  // const { user } = useAuth();
  const roomId = params.id;

  const history = useHistory();

  const { questions, title } = useRoom(roomId);

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    });

    history.push('/');
  }

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm('Tem certeza que você deseja excluir esta pergunta?')) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <div>
            <RoomCode code={roomId} />
            <Button isOutlined onClick={handleEndRoom}>
              Encerrar sala
            </Button>
          </div>
        </div>
      </header>
      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

        <div className="question-list">
          {questions.map((question) => (
            <Question
              key={question.id}
              content={question.content}
              author={question.author}
            >
              <button
                type="button"
                onClick={() => handleDeleteQuestion(question.id)}
              >
                <img src={deleteImg} alt="Remover Pergunta" />
              </button>
            </Question>
          ))}
        </div>
      </main>
    </div>
  );
}

export default AdminRoom;
