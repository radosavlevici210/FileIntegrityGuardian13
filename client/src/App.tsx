
import { useState } from "react";
import { Button } from "@/components/ui/button";
import "./App.css";

function App() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/projects");
      const data = await response.json();
      setProjects(data.projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            🎵 RealArtist AI
          </h1>
          <p className="text-xl text-blue-200 mb-8">
            Professional AI Music Production Platform
          </p>
          <div className="flex justify-center gap-4">
            <Button 
              variant="primary" 
              size="lg"
              onClick={fetchProjects}
              disabled={loading}
            >
              {loading ? "Loading..." : "View Projects"}
            </Button>
            <Button variant="secondary" size="lg">
              Create New Song
            </Button>
          </div>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-4">
              🎤 AI Vocal Styles
            </h2>
            <ul className="space-y-2 text-blue-200">
              <li>• Pop Artist</li>
              <li>• Hip-Hop Vocals</li>
              <li>• R&B Singer</li>
              <li>• Rock Voice</li>
            </ul>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-4">
              🎼 Production Features
            </h2>
            <ul className="space-y-2 text-blue-200">
              <li>• Lyrics to Song</li>
              <li>• Multi-Language</li>
              <li>• Professional Mixing</li>
              <li>• Royalty Management</li>
            </ul>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-4">
              📊 Analytics
            </h2>
            <ul className="space-y-2 text-blue-200">
              <li>• Streaming Metrics</li>
              <li>• Revenue Tracking</li>
              <li>• Global Distribution</li>
              <li>• Performance Insights</li>
            </ul>
          </div>
        </main>

        <footer className="text-center mt-12 text-blue-200">
          <p>© 2025 RealArtist AI - Professional Music Production Platform</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
