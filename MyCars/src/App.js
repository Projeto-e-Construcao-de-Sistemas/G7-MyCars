import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap';
import { AppRoutes } from './routes/appRouter';
import { AuthenticationProvider } from './context/authenticationContext';

function App() {
  return (
    <AuthenticationProvider>
      <AppRoutes />
    </AuthenticationProvider>
  );
}

export default App;
