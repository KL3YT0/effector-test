import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Todo } from './pages/Todo';
import './App.css';

function App() {
    return (
        <>
            <Todo />
            <ToastContainer />
        </>
    );
}

export default App;
