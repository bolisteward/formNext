//"use server";

import { NextResponse } from "next/server";

import fs from "fs";
import path from "path";
import { writeFile } from "fs/promises";
import { formDataFamiliar } from "@typesApp/index";


const saveFile = async (file: File, lastname: string, id:string) => {
  if (!file) {
    throw new Error("No files received.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const date = new Date(Date.now()).toISOString().split("T")[0];
  const filename = Date.now() + "-" + lastname.replaceAll(" ", "_") + "-" +id + path.extname(file.name).toLowerCase();
  
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

  if (formData.get("passport")) {
    const formDataObject: formDataFamiliar = {
      action: "conyugue",
      registration_date: urlIMG.split("/")[0],
      names: formData.get("nombres") as string,
      surnames: formData.get("apellidos") as string,    
      passport: formData.get("passport") as string,
      passport_emision: formData.get("passport_emision") as string,
      passport_expiration: formData.get("passport_expiration") as string,
      id_aplicante: formData.get("id_aplicante") as string,
      foto_url: urlIMG as string,
    };    
    return JSON.stringify(formDataObject);

  } else if (formData.get("edad")) {
    const formDataObject: formDataFamiliar = {
      action: "kid",
      registration_date: urlIMG.split("/")[0],
      names: formData.get("nombres") as string,
      surnames: formData.get("apellidos") as string,  
      edad: formData.get("edad") as string,  
      id_aplicante: formData.get("id_aplicante") as string,
      foto_url: urlIMG as string,
    };  
    return JSON.stringify(formDataObject);
  }

  else{
    throw new Error("Incorrect format data!");
    
  }
  
  
}


export async function POST(request: Request) {
  try {

    const dataFamiliar = await request.formData();

    const urlIMG = await saveFile(dataFamiliar.get("foto") as File, dataFamiliar.get("apellidos")?.toString()!, dataFamiliar.get("id_aplicante")?.toString()!);
    
    const jsondata = createJSONdata(dataFamiliar, urlIMG);

  
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

    return NextResponse.json({ mensaje_fm: data.mensaje });
  } catch (e) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
