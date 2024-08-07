import { AuthProvider } from "@client/components/context/auth-context";
import MainLayout from "@client/components/layouts/main-layout";
import HomePage from "@client/pages/home/page";

const App = () => {
  return (
    <AuthProvider>
      <MainLayout>
        <HomePage />
      </MainLayout>
    </AuthProvider>
  );
};

export default App;
