import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { CardSession } from './screens/cards/CardSession';
import { Cards } from './screens/cards/Cards';
import { CardEditor } from './screens/custom/CardEditor';
import { QuestionEditor } from './screens/custom/QuestionEditor';
import { Questions } from './screens/custom/Questions';
import { SimuladoExam } from './screens/simulado/SimuladoExam';
import { SimuladoHome } from './screens/simulado/SimuladoHome';
import { SimuladoReport } from './screens/simulado/SimuladoReport';
import { MissionDone } from './screens/MissionDone';
import { Path } from './screens/Path';
import { ProgressScreen } from './screens/ProgressScreen';
import { Session } from './screens/session/Session';
import { Shell } from './screens/Shell';
import { Today } from './screens/Today';
import { TopicGuide } from './screens/TopicGuide';
import { SyncConflict } from './screens/SyncConflict';
import { Welcome } from './screens/Welcome';
import { useApp } from './store';

export function App() {
  const status = useApp((s) => s.status);
  const hasUser = useApp((s) => s.data !== null);
  const chooseAccount = useApp((s) => s.chooseAccount);
  if (status === 'loading') return null;

  return (
    <>
      {hasUser && !chooseAccount ? <AppRoutes /> : <Welcome />}
      <SyncConflict />
    </>
  );
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Shell />}>
          <Route path="/" element={<Today />} />
          <Route path="/trilha" element={<Path />} />
          <Route path="/cartoes" element={<Cards />} />
          <Route path="/cartoes/novo" element={<CardEditor />} />
          <Route path="/cartoes/editar/:id" element={<CardEditor />} />
          <Route path="/questoes" element={<Questions />} />
          <Route path="/questoes/nova" element={<QuestionEditor />} />
          <Route path="/questoes/editar/:id" element={<QuestionEditor />} />
          <Route path="/simulado" element={<SimuladoHome />} />
          <Route path="/simulado/resultado/:id" element={<SimuladoReport />} />
          <Route path="/assunto/:topicId" element={<TopicGuide />} />
          <Route path="/progresso" element={<ProgressScreen />} />
        </Route>
        <Route path="/cartoes/estudo" element={<CardSession />} />
        <Route path="/sessao" element={<Session />} />
        <Route path="/simulado/prova" element={<SimuladoExam />} />
        <Route path="/concluida" element={<MissionDone />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
