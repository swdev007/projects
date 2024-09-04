import { StorageEnums } from "@/app/_lib/enum/storage";
import { type NextRequest, NextResponse } from "next/server";

export default function middleware(request: NextRequest) {
  let isLogin = Boolean(request?.cookies.get(StorageEnums.CREDENTIALS));
  if (!isLogin && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next();
}
