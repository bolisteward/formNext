//"use server";

import { NextResponse } from "next/server";
//export const dynamic = "force-static";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const names = searchParams.get("names");
    const surnames = searchParams.get("surnames");
    
    const url = new URL("https://form.visaglobal.com.ec/register/");
    url.searchParams.append("names", names ?? "");
    url.searchParams.append("surnames", surnames ?? "");


    const res = await fetch(url.toString());

    if (!res.ok) {
      console.error("Error en la solicitud:", res.status);
      throw new Error("Error en la solicitud");
    }

    const data = await res.json();

    return NextResponse.json({
      mensaje: data.mensaje,
      aplicante: data.aplicante,
      familiares: data.familiares
    });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
