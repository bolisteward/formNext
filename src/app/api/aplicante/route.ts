//"use server";

import { NextResponse } from "next/server";

import fs from "fs";
import path from "path";
import { writeFile } from "fs/promises";
import { FormDataAplicante } from "@typesApp/index";

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
    return date + "/" + filename;
  } catch (error) {
    throw error;
  }
};

const createJSONdata = (formData:FormData, urlIMG: string ) => {
  const formDataObject: FormDataAplicante = {
    action: "aplicante",
    registration_date: urlIMG.split("/")[0],
    names: formData.get("nombres") as string,
    surnames: formData.get("apellidos") as string,
    sexo: formData.get("sexo") as string,
    birth_date: formData.get("fecha_nacimiento") as string,
    birth_city: formData.get("ciudad_nacimiento") as string,
    birth_country: formData.get("pais_nacimiento") as string,
    residence_country: formData.get("pais_residencia") as string,
    civil_status: formData.get("estado_civil") as string,
    children: formData.get("children") as string,
    phone: formData.get("phone") as string,
    email: formData.get("email") as string,
    address: formData.get("address") as string,
    passport: formData.get("passport") as string,
    passport_emision: formData.get("passport_emision") as string,
    passport_expiration: formData.get("passport_expiration") as string,
    education: formData.get("education") as string,
    foto_url: urlIMG as string,
  };

  return JSON.stringify(formDataObject);
}

export async function POST(request: Request) {
  try {

    const dataAplicante = await request.formData();

    const urlIMG = await saveFile(dataAplicante.get("foto") as File, dataAplicante.get("apellidos")?.toString()!);
    
    const jsondata = createJSONdata(dataAplicante, urlIMG);   
    console.log(jsondata); 

    const response = await fetch("https://form.visaglobal.com.ec/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Establecer el tipo de contenido a JSON
      },
      body: jsondata,
    });

    if (!response.ok) {

      console.error("Error en la solicitud:", response.status);
      throw new Error("Error en la solicitud");
    } 

    const data = await response.json();
    
    return NextResponse.json({ mensaje_ap: data.mensaje, id_aplicante: data.id });
  } catch (e) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

