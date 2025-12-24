import "./globals.css";
import { AppProvider } from "../components/AppProvider";
import ShellLayout from "../components/ShellLayout";

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
            <ShellLayout>{children}</ShellLayout>
          </AppProvider>
        </div>
      </body>
    </html>
  );
}
