import "./globals.css";
import Navbar from "../components/Navbar";
import { AppProvider } from "../components/AppProvider";

export const metadata = {
  title: "EcoSync",
  description: "Sustainability rewards and honesty platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="shell">
          <AppProvider>
            <Navbar />
            {children}
          </AppProvider>
        </div>
      </body>
    </html>
  );
}
