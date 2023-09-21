//"use server";

import fs from "fs";
import path from "path";
import { writeFile } from "fs/promises";
import { FormDataAplicante, formDataFamiliar } from "@typesApp/index";

const saveFile = async (file: File, lastname: string, id:string) => {
  if (!file) {
    throw new Error("No files received.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const date = new Date(Date.now()).toISOString().split("T")[0];
  const filename =
    Date.now() +
    "-" +
    lastname.replaceAll(" ", "_") + "-" +id +
    path.extname(file.name).toLowerCase();

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

const createJSONdata = (
  typePerson: string,
  formData: FormData,
  urlIMG: string
) => {
  if (typePerson === "aplicante") {
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
  }else  if (typePerson === "conyugue") {
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
  }

  else if (typePerson === "kid") {
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
};

export async function POSTData(dataAplicante: FormData) {
  try {
    const urlIMG = await saveFile(
      dataAplicante.get("foto") as File,
      dataAplicante.get("apellidos")?.toString()!,
      dataAplicante.get("id_aplicante")? dataAplicante.get("id_aplicante")?.toString()! : ""
    );

    const jsondata = createJSONdata(dataAplicante.get("action") as string, dataAplicante, urlIMG);

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

    return {
      mensaje_ap: data.mensaje,
      id_aplicante: data.id,
    };
  } catch (e) {
    throw new Error("Internal Server Error");
  }
}

