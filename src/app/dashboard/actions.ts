//"use server";
import { SubmitHandler } from "react-hook-form";
import { IFormSearch } from "@typesApp/index";


export const onSubmit: SubmitHandler<IFormSearch> = async (
  data: IFormSearch
) => {
  try {
    /*
    const url = new URL("https://form.visaglobal.com.ec/register/");
    url.searchParams.append("names", data.names_search.toUpperCase());
    url.searchParams.append("surnames", data.surnames_search.toUpperCase());

    const forminfo = await fetch(url.toString(), {
      method: "GET",
    });
    */

    const url = new URL("http://localhost:3000/api/getdata/");
    url.searchParams.append("names", data.names_search.toUpperCase());
    url.searchParams.append("surnames", data.surnames_search.toUpperCase());

    const forminfo = await fetch(url.toString());

    if (!forminfo.ok) {
      throw new Error("No se pudo obtener la respuesta de la API");
    }

    const aplicante_data = await forminfo.json();

    console.log("informacion recivida");
    console.log(aplicante_data);

    //setValue("first_name", aplicante_data.aplicante.names);

  } catch (error) {
    alert("Error while sending form, please try one more time!");
    console.error("Error al llamar a la API:", error);
  }
};
