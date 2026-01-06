import { useState } from "react";
import AuthPage from "@/components/AuthPage";
import MainApp from "@/components/MainApp";
import FloatingOrbs from "@/components/FloatingOrbs";
import ThemeToggle from "@/components/ThemeToggle";

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  const handleLogin = (user: string) => {
    setUsername(user);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
  };

  return (
    <div className="relative min-h-screen bg-background transition-colors duration-300">
      <FloatingOrbs />
      
      {/* Theme toggle - fixed position */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      
      <div className="relative z-10">
        {isLoggedIn ? (
          <MainApp username={username} onLogout={handleLogout} />
        ) : (
          <AuthPage onLogin={handleLogin} />
        )}
      </div>
    </div>
  );
};

export default Index;
