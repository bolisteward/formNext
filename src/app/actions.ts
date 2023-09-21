//"use server";
import { useForm, SubmitHandler } from "react-hook-form";
import { IFormInput } from "@typesApp/index";

export const onSubmit: SubmitHandler<IFormInput> = async (
  data: IFormInput
) => {
  try {
    const formDataAplicante = new FormData();
    formDataAplicante.append(
      "nombres",
      `${data.first_name.toUpperCase()} ${data.second_name.toUpperCase()}`
    );
    formDataAplicante.append("apellidos", data.apellidos.toUpperCase());
    formDataAplicante.append("sexo", data.sexo);
    formDataAplicante.append(
      "fecha_nacimiento",
      data.fecha_nacimiento.toString()
    );
    formDataAplicante.append("ciudad_nacimiento", data.ciudad_nacimiento);
    formDataAplicante.append("pais_nacimiento", data.pais_nacimiento);
    formDataAplicante.append("pais_residencia", data.pais_residencia);
    formDataAplicante.append("estado_civil", data.estado_civil);
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
    
    const aplicante_res = await fetch("/api/aplicante", {
      method: "POST",
      body: formDataAplicante,
    });

    if (!aplicante_res.ok) {
      throw new Error("No se pudo obtener la respuesta de la API");
    } 
    
    console.log(aplicante_res);
    
    const { mensaje_ap, id_aplicante } = await aplicante_res.json();

    if (data.estado_civil === "casado") {
      const formDataConyugue = new FormData();
      formDataConyugue.append(
        "nombres",
        `${data.first_name_conyugue.toUpperCase()} ${data.second_name_conyugue.toUpperCase()}`
      );
      formDataConyugue.append(
        "apellidos",
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
      formDataConyugue.append("foto", data.foto_conyugue[0] as File);
      formDataConyugue.append("id_aplicante", id_aplicante);

      const conyugue_res = await fetch("/api/familiar", {
        method: "POST",
        body: formDataConyugue,
      });

      if (!conyugue_res.ok) {
        throw new Error("No se pudo obtener la respuesta de la API");
      }
    }

    if (data.children.length > 0) {

      const promises = data.children.map(async (kid, index) => {
        const formDataKid = new FormData();
        formDataKid.append(
          "nombres",
          `${kid.first_name.toUpperCase()} ${kid.second_name.toUpperCase()}`
        );
        formDataKid.append("apellidos", kid.apellidos.toUpperCase());
        formDataKid.append("edad", kid.edad.toString());
        formDataKid.append("foto", kid.foto_kid? kid.foto_kid[0] as File : "foto.jpg");
        formDataKid.append("id_aplicante", id_aplicante);
          
        const kid_res = await fetch("/api/familiar", {
          method: "POST",
          body: formDataKid,
        });

        if (!kid_res.ok) {
          // Puedes personalizar el mensaje de error según tus necesidades
          throw new Error(`Error al procesar el niñ@ ${kid.first_name}`);
        }

        return kid_res; 
      });
      
      await Promise.all(promises);
    }

    alert("Enviado exitosamente!. Nos contactaremos mediante el número telefónico del aplicante.");

  } catch (error) {
    alert("Error while sending form, please try one more time!");
    console.error("Error al llamar a la API:", error);
  }
};
