//"use server";
import { SubmitHandler } from "react-hook-form";
import {
  IFormInput,  
} from "@typesApp/index";

export const onSubmit: SubmitHandler<IFormInput> = async (data: IFormInput) => {
  try {
    console.log(data);
    const date = new Date(Date.now()).toISOString().split("T")[0];

    const formDataAplicante = new FormData();

    formDataAplicante.append("action", "aplicante");
    formDataAplicante.append("registration_date", date);
    formDataAplicante.append(
      "names",
      `${data.first_name.toUpperCase()} ${data.second_name.toUpperCase()}`
    );
    formDataAplicante.append("surnames", data.apellidos.toUpperCase());
    formDataAplicante.append("sexo", data.sexo);
    formDataAplicante.append("birth_date", data.fecha_nacimiento.toString());
    formDataAplicante.append("birth_city", data.ciudad_nacimiento.toUpperCase());
    formDataAplicante.append("birth_country", data.pais_nacimiento.toUpperCase());
    formDataAplicante.append("residence_country", data.pais_residencia.toUpperCase());

    formDataAplicante.append("civil_status", data.estado_civil);
    formDataAplicante.append("children", data.children.length.toString());
    formDataAplicante.append("phone", data.phone);
    formDataAplicante.append("email", data.email);
    formDataAplicante.append("address", data.direccion);
    formDataAplicante.append("passport", data.passport);
    formDataAplicante.append(
      "passport_emision",
      data.passport_emision.toString()
    );
    formDataAplicante.append(
      "passport_expiration",
      data.passport_expiration.toString()
    );
    formDataAplicante.append("education", data.education);
    formDataAplicante.append("foto", data.foto_aplicante[0] as File);

    const aplicante_res = await fetch(
      "https://form.visaglobal.com.ec/register/",
      {
        method: "POST", 
        body: formDataAplicante,
      }
    );

    if (!aplicante_res.ok) {
      throw new Error("No se pudo obtener la respuesta de la API");
    }

    const aplicante_data = await aplicante_res.json();

    console.log(aplicante_data.id);

    if (data.estado_civil === "casado") {
      const formDataConyugue = new FormData();
      formDataConyugue.append("action", "conyugue");
      formDataConyugue.append("registration_date", date);

      formDataConyugue.append(
        "names",
        `${data.first_name_conyugue.toUpperCase()} ${data.second_name_conyugue.toUpperCase()}`
      );
      formDataConyugue.append(
        "surnames",
        data.apellidos_conyugue.toUpperCase()
      );
      formDataConyugue.append("passport", data.passport_conyugue);
      formDataConyugue.append(
        "passport_emision",
        data.passport_emision_conyugue.toString()
      );
      formDataConyugue.append(
        "passport_expiration",
        data.passport_expiration_conyugue.toString()
      );
      formDataConyugue.append("id_aplicante", aplicante_data.id);
      formDataConyugue.append("foto", data.foto_conyugue[0] as File);

      const conyugue_res = await fetch(
        "https://form.visaglobal.com.ec/register/",
        {
          method: "POST",
          body: formDataConyugue,
        }
      );

      if (!conyugue_res.ok) {
        throw new Error("No se pudo obtener la respuesta de la API");
      }
    }

    if (data.children.length > 0) {
      const promises = data.children.map(async (kid, index) => {
        const formDataKid = new FormData();
        formDataKid.append("action", "kid");
        formDataKid.append("registration_date", date);
        formDataKid.append(
          "names",
          `${kid.first_name.toUpperCase()} ${kid.second_name.toUpperCase()}`
        );
        formDataKid.append("surnames", kid.apellidos.toUpperCase());
        formDataKid.append("edad", kid.edad.toString());
        formDataKid.append("id_aplicante", aplicante_data.id);

        if (kid.foto_kid && kid.foto_kid.length > 0) {
          formDataKid.append("foto", kid.foto_kid[0] as File);
        } else {
          throw new Error(`Error loading photo of niñ@ ${kid.first_name}`);
        }

        const kid_res = await fetch(
          "https://form.visaglobal.com.ec/register/",
          {
            method: "POST",
            body: formDataKid,
          }
        );

        if (!kid_res.ok) {
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
