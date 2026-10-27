import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "PacMind AI | Autonomous Pac-Man Agent (A* Heuristic)",
  description: "PacMind AI Heuristic Edition: Autonomous Pac-Man intelligent agent using A* pathfinding with Manhattan distance heuristics and multi-agent BFS ghost pursuit. Developed by Ashank Gupta.",
  keywords: [
    "PacMind AI",
    "Pac-Man AI",
    "A* Search Algorithm",
    "Breadth-First Search",
    "BFS",
    "Artificial Intelligence",
    "Ashank Gupta",
    "Next.js",
    "Tailwind CSS",
    "Canvas Animation",
    "Manhattan Distance",
  ],
  authors: [{ name: "Ashank Gupta" }],
  creator: "Ashank Gupta",
  openGraph: {
    title: "PacMind AI | Autonomous Pac-Man Agent (A* Heuristic)",
    description: "Autonomous Pac-Man agent powered by A* Search with Manhattan heuristics. Developed by Ashank Gupta.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "PacMind AI | Autonomous Pac-Man Agent (A* Heuristic)",
    description: "Autonomous Pac-Man agent powered by A* Search with Manhattan heuristics. Developed by Ashank Gupta.",
    creator: "@ashankgupta",
  },
};

export const viewport = {
  themeColor: "#08090d",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#08090d] text-slate-100">
        {children}
      </body>
    </html>
  );
}
