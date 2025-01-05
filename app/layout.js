import "./globals.css";

export const metadata = {
  title: "SimVest",
  description: "Ever wanted to invest but not confident enough to spend real money, this is the right tool for you.",
};



export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="https://i.postimg.cc/JzB15bCh/abstract-shape.png" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
