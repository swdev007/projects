import RootChildrens from "@/components/Wrapper/RootChildrens";
import type { Metadata } from "next";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Providers } from "./_lib/GlobalRedux/provider";
import "./globals.scss";
export const revalidate = 0;
export const metadata: Metadata = {
  title: "",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <RootChildrens>
            <>
              {children}
              <ToastContainer autoClose={2000} />
            </>
          </RootChildrens>
        </Providers>
      </body>
    </html>
  );
}