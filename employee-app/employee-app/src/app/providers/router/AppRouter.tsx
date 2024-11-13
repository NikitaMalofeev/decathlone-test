
import { MainPage } from '../../../pages/MainPage';
import { BrowserRouter as Routes, Route } from 'react-router-dom';

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<MainPage />} />
        </Routes>
    );
};

export default AppRouter;
