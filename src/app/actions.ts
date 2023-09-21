//"use server";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  FormDataAplicante,
  IFormInput,
  formDataFamiliar,
} from "@typesApp/index";

export const onSubmit: SubmitHandler<IFormInput> = async (data: IFormInput) => {
  try {
    const formDataAplicante: FormDataAplicante = {
      action: "aplicante",
      registration_date: "2023-09-20", //urlIMG.split("/")[0],
      names: `${data.first_name.toUpperCase()} ${data.second_name.toUpperCase()}`,
      surnames: data.apellidos.toUpperCase(),
      sexo: data.sexo,
      birth_date: data.fecha_nacimiento.toString(),
      birth_city: data.ciudad_nacimiento,
      birth_country: data.pais_nacimiento,
      residence_country: data.pais_residencia,
      civil_status: data.estado_civil,
      children: data.children.length.toString(),
      phone: data.phone,
      email: data.email,
      address: data.direccion,
      passport: data.passport,
      passport_emision: data.passport_emision.toString(),
      passport_expiration: data.passport_expiration.toString(),
      education: data.education,
      foto_url: "url",
    };

    const aplicante_res = await fetch(
      "https://form.visaglobal.com.ec/register/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Establecer el tipo de contenido a JSON
        },
        body: JSON.stringify(formDataAplicante),
      }
    );

    if (!aplicante_res.ok) {
      throw new Error("No se pudo obtener la respuesta de la API");
    }

    const aplicante_data = await aplicante_res.json();

    console.log(aplicante_data.id);

    if (data.estado_civil === "casado") {
      const formDataConyugue: formDataFamiliar = {
        action: "conyugue",
        registration_date: "2023-09-20",
        names: `${data.first_name_conyugue.toUpperCase()} ${data.second_name_conyugue.toUpperCase()}`,
        surnames: data.apellidos_conyugue.toUpperCase(),
        passport: data.passport_conyugue,
        passport_emision: data.passport_emision_conyugue.toString(),
        passport_expiration: data.passport_expiration_conyugue.toString(),
        id_aplicante: aplicante_data.id,
        foto_url: "upload",
      };

      const conyugue_res = await fetch(
        "https://form.visaglobal.com.ec/register/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Establecer el tipo de contenido a JSON
          },
          body: JSON.stringify(formDataConyugue),
        }
      );

      if (!conyugue_res.ok) {
        throw new Error("No se pudo obtener la respuesta de la API");
      }
    }

    if (data.children.length > 0) {
      const promises = data.children.map(async (kid, index) => {

        const formDataKid: formDataFamiliar = {
          action: "kid",
          registration_date: "2023-09-20",
          names: `${kid.first_name.toUpperCase()} ${kid.second_name.toUpperCase()}`,
          surnames: kid.apellidos.toUpperCase(),  
          edad:  kid.edad.toString(),  
          id_aplicante: aplicante_data.id,
          foto_url: "upload"//kid.foto_kid[0] as File,
        }; 

        const kid_res = await fetch(
          "https://form.visaglobal.com.ec/register/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json", // Establecer el tipo de contenido a JSON
            },
            body: JSON.stringify(formDataKid),
          }
        );

        if (!kid_res.ok) {
          // Puedes personalizar el mensaje de error según tus necesidades
          throw new Error(`Error al procesar el niñ@ ${kid.first_name}`);
        }

        return kid_res;
      });

      await Promise.all(promises);
    }

    alert(
      "Enviado exitosamente!. Nos contactaremos mediante el número telefónico del aplicante."
    );
  } catch (error) {
    alert("Error while sending form, please try one more time!");
    console.error("Error al llamar a la API:", error);
  }
};
