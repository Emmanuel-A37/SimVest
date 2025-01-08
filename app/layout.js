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
        <div className="max-sm:hidden">
          {children}
        </div>
        <div className="sm:hidden text-center ">
          Please use a laptop to view this site
        </div>
      </body>
    </html>
  );
}
