//"use server";

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { writeFile } from "fs/promises";
//export const dynamic = "force-dynamic";

const saveFile = async (file: File, lastname: string) => {
  if (!file) {
    throw new Error("No files received.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const date = new Date(Date.now()).toISOString().split("T")[0];
  const filename = Date.now() + "-" + lastname.replaceAll(" ", "_") + path.extname(file.name).toLowerCase();
  
  try {
    const directoryPath = path.join(process.cwd(), "public/uploads/" + date);
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
    }
    await writeFile(
      path.join(process.cwd(), `public/uploads/${date}/${filename}`),
      buffer
    );
    return;
  } catch (error) {
    throw error;
  }
};
export async function POST(request: Request) {
  try {

    const data = await request.formData();

    saveFile(data.get("foto_src") as File, data.get("apellidos")?.toString()!);

   

    /*
    const formData = new FormData();
    formData.append("accion", "aplicante");
    formData.append("nombres", "juanito gomez");
    formData.append("apellidos", "pedro ibarra");
    formData.append("sexo", "hombre");
    formData.append("fecha_nac", "2023/07/10");
    formData.append("ciudad_nac", "uio");
    formData.append("pais_nac", "ecu");
    formData.append("estado_civil", "soltero");
    formData.append("celular", "0895451258");
    formData.append("email", "bsnm@ht.com");
    formData.append("address", "bellavista");
    formData.append("passport", "0991215948");
    formData.append("passport_emision", "2023/12/15");
    formData.append("passport_expiration", "2023/12/01");
    formData.append("educacion", "colegio");
    formData.append("foto_url", "/fot/gb.png");    

    const formDataObject: FormDataObject = {
      accion: formData.get("accion") as string,
      nombres: formData.get("nombres") as string,
      apellidos: formData.get("apellidos") as string,
      sexo: formData.get("sexo") as string,
      fecha_nac: formData.get("fecha_nac") as string,
      ciudad_nac: formData.get("ciudad_nac") as string,
      pais_nac: formData.get("pais_nac") as string,
      estado_civil: formData.get("estado_civil") as string,
      celular: formData.get("celular") as string,
      email: formData.get("email") as string,
      address: formData.get("address") as string,
      passport: formData.get("passport") as string,
      passport_emision: formData.get("passport_emision") as string,
      passport_expiration: formData.get("passport_expiration") as string,
      educacion: formData.get("educacion") as string,
      foto_url: formData.get("foto_url") as string,
    };
    const response = await fetch("https://form.rosekingdom.world/api/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Establecer el tipo de contenido a JSON
      },
      body: JSON.stringify(formDataObject),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("data del php", data.mensaje);
      console.log("data del php", data.id);
    } else {
      console.error("Error en la solicitud:", response.status);
      throw new Error("Error en la solicitud");
    }
    */

    return NextResponse.json({ data: "data" });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
