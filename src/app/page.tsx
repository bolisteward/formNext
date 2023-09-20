"use client";
import "./globals.css";
import {
  Divider,
  Input,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
  Switch,
  Button,
  Skeleton,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Checkbox,
  Link,
} from "@nextui-org/react";

import Image from "next/image";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { POSTData } from "./actions";
import { IFormInput } from "@typesApp/index";
import { useEffect, useState } from "react";
import { Man, Woman } from "@styled-icons/ionicons-solid";
import { PersonDelete, PersonAdd } from "@styled-icons/fluentui-system-filled";

import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import es from "react-phone-number-input/locale/es";

export default function Page() {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { isSubmitting },
  } = useForm<IFormInput>({
    defaultValues: {
      children: [
        {
          first_name: "CARLOS",
          second_name: "JAIME",
          apellidos: "TERAN VERA",
          edad: 5,
        },
      ],
    },
    mode: "onBlur",
  });

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [createObjectURLs, setCreateObjectURLs] = useState<
    Record<string, string | null>
  >({});

  const [sexo, setSexo] = useState<string | null>(null);
  const [estadoCivil, setEstadoCivil] = useState<string | null>(null);
  const [haveKids, setHaveKids] = useState<boolean>(false);
  const [acceptPolitics, setAcceptPolitics] = useState<boolean>(false);
  const [typeWarning, setTypeWarning] = useState<"politics" | "warning">(
    "politics"
  );
  const { fields, append, remove } = useFieldArray({
    name: "children",
    control,
  });

  const labelsStyle = "text-primary font-bold text-medium";
  const inputStyle =
    "bg-transparent text-primary/90 placeholder:text-primary/50 ";

  const uploadToClient = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number,
    typePerson: string
  ) => {
    if (event.target.files && event.target.files[0]) {
      const photofile = event.target.files;
      const maxSize = 1024 * 1024; // 1MB

      if (photofile[0].size > maxSize) {
        setTypeWarning("warning");
        onOpen();
        return;
      }

      switch (typePerson) {
        case "aplicante":
          setCreateObjectURLs((prevURLs) => ({
            ...prevURLs,
            ["aplicante"]: URL.createObjectURL(photofile[0]),
          }));
          break;
        case "conyugue":
          setCreateObjectURLs((prevURLs) => ({
            ...prevURLs,
            ["conyugue"]: URL.createObjectURL(photofile[0]),
          }));
          break;

        case "kid":
          setValue(`children.${index}.foto_kid`, photofile);
          setCreateObjectURLs((prevURLs) => ({
            ...prevURLs,
            [`kid_${index}`]: URL.createObjectURL(photofile[0]),
          }));
          break;

        default:
          break;
      }
    }
  };



  const onSubmit: SubmitHandler<IFormInput> = async (
    data: IFormInput
  ) => {
    try {
      const formDataAplicante = new FormData();
      formDataAplicante.append("action", "aplicante");
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

      const { mensaje_ap,  id_aplicante } =  await POSTData(formDataAplicante);
      
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
  
        const result_conyugue =  await POSTData(formDataConyugue);
        
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
            
          const result_kid =  await POSTData(formDataKid);

        });     
        
        await Promise.all(promises);
      }
    } catch (e) {
      console.error("Error parsing form", e );
    }
  }


  useEffect(() => {
    if (!haveKids) {
      remove();
    }
  }, [haveKids, remove]);

  return (
    <div
      id="in_body"
      className="flex relative w-full h-fit bg-background justify-center overflow-x-hidden"
    >
      <div className="flex absolute w-screen h-full opacity-70 bg-gradient-to-r from-blue-200 via-sky-800 to-sky-200 ">
        {/*<Image
          src="/pictures/backgrounds/airplane.jpg"
          alt="logo"
          fill
          style={{ objectFit: "cover" }}
  />*/}
      </div>
      <div id="Page1" className="flex relative flex-col z-0 w-3/4 items-center">
        <div
          id="logo"
          className="flex z-10  relative my-unit-md w-full aspect-w-8 aspect-h-1 "
        >
          <Image
            src="/pictures/logo/visa-global-logo.webp"
            alt="logo"
            fill
            style={{ objectFit: "contain" }}
          />
        </div>

        <div
          id="form_body"
          className="flex relative w-4/5 h-full text-xl text-secondary font-bold mb-unit-3xl"
        >
          <div className="flex absolute -z-30 w-full h-full bg-white border-2 border-primary/70 rounded-medium"></div>

          <div className="flex flex-col text-primary">
            <div className="mb-4">
              <h1 className="text-4xl flex w-full h-auto justify-center my-10 ">
                Visa Form
              </h1>
              <Divider className="my-5 bg-primary" />
              <p className="m-unit-md">
                {
                  "INDICACIONES: No puede quedar nada vacío, detallar dirección exacta – manzana, villa, solar, etc. Información incompleta puede descalificar su aplicación automáticamente – instrucción educativa no puede quedar vacio, indicar educación mas alta obtenida."
                }
              </p>
              <Divider className="my-5 bg-primary" />
            </div>
            <div className="mb-4 p-unit-xl ">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid grid-cols-1 gap-5  "
              >
                <div
                  id="nombres_completos"
                  className="grid grid-cols-3 gap-3 border-2 border-primary/50 rounded-lg"
                >
                  <div className="col-span-3 border-b-2 border-primary/50  p-4">
                    <h1>Nombres completos</h1>
                  </div>

                  <div className="p-4 col-span-3 text-medium font-normal ">
                    Nota: Colocar nombres y apellidos como se muestran en su
                    documento de identidad.
                  </div>
                  <div className="p-4 ">
                    <Input
                      type="text"
                      size="lg"
                      isRequired
                      variant="underlined"
                      label="Primer nombre"
                      {...register("first_name")}
                      labelPlacement="outside"
                      placeholder="JORGE"
                      classNames={{
                        label: labelsStyle,
                        input: inputStyle,
                      }}
                    />
                  </div>
                  <div className="p-4 ">
                    <Input
                      type="text"
                      size="lg"
                      isRequired
                      variant="underlined"
                      label="Segundo nombre"
                      {...register("second_name")}
                      labelPlacement="outside"
                      placeholder="CARLOS"
                      classNames={{
                        label: labelsStyle,
                        input: inputStyle,
                      }}
                    />
                  </div>
                  <div className="p-4 ">
                    <Input
                      size="lg"
                      type="text"
                      isRequired
                      variant="underlined"
                      {...register("apellidos")}
                      label="Apellidos"
                      labelPlacement="outside"
                      placeholder="CRUZ VELEZ"
                      classNames={{
                        label: labelsStyle,
                        input: inputStyle,
                      }}
                    />
                  </div>
                </div>

                <div
                  id="genero"
                  className="grid grid-cols-2 gap-3 border-2 border-primary/50 rounded-lg"
                >
                  <div className="col-span-2 border-b-2 border-primary/50  p-4">
                    <h1>Género</h1>
                  </div>
                  <div className="p-4 ">
                    <RadioGroup
                      isRequired
                      label="Sexo"
                      {...register("sexo", {
                        onChange: (e) => setSexo(e.target.value),
                      })}
                      orientation="horizontal"
                      classNames={{
                        label: labelsStyle,
                      }}
                    >
                      <Radio value={"hombre"} key="hombre">
                        <div
                          className={`flex flex-row flex-nowrap items-center text-medium ${
                            sexo === "hombre" && "text-primary"
                          }`}
                        >
                          <Man className="h-8 aspect-w-1" />
                          <span>Masculino</span>
                        </div>
                      </Radio>
                      <Radio value={"mujer"} key="mujer">
                        <div
                          className={`flex flex-row flex-nowrap items-center text-medium ${
                            sexo === "mujer" && "text-pink-400"
                          }`}
                        >
                          <Woman className="h-8 aspect-w-1" />
                          <span>Femenino</span>
                        </div>
                      </Radio>
                    </RadioGroup>
                  </div>
                </div>

                <div
                  id="estado_civil"
                  className="grid grid-cols-2 gap-3 border-2 border-primary/50 rounded-lg"
                >
                  <div className="col-span-2 border-b-2 border-primary/50  p-4">
                    <h1>Estado civil</h1>
                  </div>
                  <div className="col-span-2 p-4  text-medium font-normal ">
                    <ol className="list-disc list-inside">
                      <li className="mb-4">
                        Pasajeros en unión libre - unión de hecho/concubinato no
                        pueden aplicar con su pareja. Deben aplicar por
                        individual con sus hijos. Para aplicar como familia
                        deben estar legalmente casados.
                      </li>
                      <li className="mb-4">
                        Si el cónyuge es ciudadano/a o residente Permanente de
                        los Estados Unidos, no es necesario ingresar su
                        información.
                      </li>
                      {estadoCivil === "separado" && (
                        <li className="mb-4">
                          Separado/a quiere decir que la pareja no vive junta a
                          pesar de estar legalmente casados. Su esposo/a no
                          podrá migrar a los Estados Unidos a través de este
                          programa de lotería de visa.
                        </li>
                      )}
                    </ol>
                  </div>
                  <div className="p-4 ">
                    <Select
                      isRequired
                      labelPlacement="outside"
                      label="Seleccione"
                      {...register("estado_civil", {
                        onChange: (e) => setEstadoCivil(e.target.value),
                      })}
                      placeholder="Seleccione una opción"
                      variant="underlined"
                      defaultSelectedKeys={["soltero"]}
                      className="max-w-xs"
                      classNames={{
                        label: labelsStyle,
                      }}
                    >
                      <SelectItem value={"soltero"} key="soltero">
                        {"Soltero(a)"}
                      </SelectItem>
                      <SelectItem value={"casado"} key="casado">
                        {"Casado(a)"}
                      </SelectItem>
                      <SelectItem value={"separado"} key="separado">
                        {"separado(a)"}
                      </SelectItem>
                      <SelectItem value={"viudo"} key="viudo">
                        {"Viudo(a)"}
                      </SelectItem>
                      <SelectItem value={"divorciado"} key="divorciado">
                        {"Divorciado(a)"}
                      </SelectItem>
                    </Select>
                  </div>

                  <div className="p-4">
                    <div className="col-span-2 text-medium mb-3">
                      <h3 className="after:content-['*'] after:text-danger after:ml-0.5">
                        Tiene hijos?
                      </h3>
                    </div>
                    <Switch
                      onValueChange={setHaveKids}
                      isSelected={haveKids}
                      aria-label="Automatic updates"
                    />
                  </div>
                </div>

                <div
                  id="fecha_nac"
                  className="grid grid-cols-2 gap-3 border-2 border-primary/50 rounded-lg"
                >
                  <div className="col-span-2 border-b-2 border-primary/50  p-4">
                    <h1>Fecha de nacimiento</h1>
                  </div>
                  <div className="p-4 ">
                    <Input
                      size="lg"
                      type="date"
                      isRequired
                      variant="underlined"
                      label="Fecha"
                      {...register("fecha_nacimiento")}
                      labelPlacement="outside"
                      placeholder="mm/dd/yyyy"
                      classNames={{
                        label: "text-primary opacity-100 font-bold",
                      }}
                    />
                  </div>
                </div>

                <div
                  id="lugar_nac"
                  className="grid grid-cols-2 gap-3 border-2 border-primary/50 rounded-lg"
                >
                  <div className="col-span-2 border-b-2 border-primary/50  p-4">
                    <h1>Lugar de nacimiento</h1>
                  </div>
                  <div className="p-4 ">
                    <Input
                      size="lg"
                      type="text"
                      variant="underlined"
                      isRequired
                      label="Ciudad de nacimiento"
                      {...register("ciudad_nacimiento")}
                      labelPlacement="outside"
                      placeholder="Ciudad"
                      classNames={{
                        label: "text-primary opacity-100 font-bold",
                        input: [
                          "bg-transparent",
                          "text-primary/90",
                          "placeholder:text-primary/50 ",
                        ],
                      }}
                    />
                  </div>
                  <div className="p-4 ">
                    <Input
                      size="lg"
                      type="text"
                      isRequired
                      variant="underlined"
                      label="Pais de nacimiento"
                      {...register("pais_nacimiento")}
                      labelPlacement="outside"
                      placeholder="Pais"
                      classNames={{
                        label: "text-primary opacity-100 font-bold",
                        input: [
                          "bg-transparent",
                          "text-primary/90",
                          "placeholder:text-primary/50 ",
                        ],
                      }}
                    />
                  </div>

                  <div className="col-span-2 p-4">
                    <Input
                      type="text"
                      label="Dirección"
                      isRequired
                      {...register("direccion")}
                      placeholder="Calle, Mz #, Villa #, etc."
                      variant="underlined"
                      labelPlacement="outside-left"
                      classNames={{
                        label: "text-primary opacity-100 font-bold",
                        input: [
                          "bg-transparent",
                          "text-primary/90",
                          "placeholder:text-primary/50",
                        ],
                      }}
                    />
                  </div>
                  <div className="p-4 ">
                    <Input
                      size="lg"
                      type="text"
                      isRequired
                      variant="underlined"
                      label="Pais de recidencia"
                      {...register("pais_residencia")}
                      labelPlacement="outside"
                      placeholder="Pais"
                      classNames={{
                        label: "text-primary opacity-100 font-bold",
                        input: [
                          "bg-transparent",
                          "text-primary/90",
                          "placeholder:text-primary/50 ",
                        ],
                      }}
                    />
                  </div>
                </div>

                <div
                  id="contacto"
                  className="grid grid-cols-2 gap-3 border-2 border-primary/50 rounded-lg"
                >
                  <div className="col-span-2 border-b-2 border-primary/50  p-4">
                    <h1>Contacto</h1>
                  </div>
                  <div className="p-4 ">
                    <div className="text-primary text-sm opacity-100 font-bold pb-2 after:content-['*'] after:text-danger after:ml-0.5">
                      Número telefónico
                    </div>

                    <PhoneInput
                      international
                      defaultCountry="EC"
                      labels={es}
                      countryCallingCodeEditable={false}
                      placeholder="Enter phone number"
                      {...register("phone", {
                        required: true,
                      })}
                      onChange={(e) => {}}
                      className="font-light border-b-2 text-md pt-2 hover:border-"
                    />
                  </div>
                  <div className="p-4 ">
                    <Input
                      type="email"
                      label="Email"
                      isRequired
                      {...register("email")}
                      placeholder="you@example.com"
                      variant="underlined"
                      labelPlacement="outside"
                      classNames={{
                        label: "text-primary opacity-100 font-bold",
                        input: [
                          "bg-transparent",
                          "text-primary/90",
                          "placeholder:text-primary/50 ",
                        ],
                      }}
                    />
                  </div>
                </div>

                <div
                  id="identidad"
                  className="grid grid-cols-2 gap-3 border-2 border-primary/50 rounded-lg"
                >
                  <div className="col-span-2 border-b-2 border-primary/50  p-4">
                    <h1>Documento de identidad</h1>
                  </div>
                  <div className="p-4 col-span-2">
                    <Input
                      type="number"
                      label="No. Pasaporte/ID"
                      isRequired
                      {...register("passport")}
                      placeholder="xxxxxxxxxx"
                      variant="underlined"
                      labelPlacement="outside"
                      classNames={{
                        label: "text-primary opacity-100 font-bold",
                        input: [
                          "bg-transparent",
                          "text-primary/90",
                          "placeholder:text-primary/50 ",
                        ],
                      }}
                    />
                  </div>
                  <div className="p-4 ">
                    <Input
                      type="date"
                      label="Fecha de emisión"
                      isRequired
                      {...register("passport_emision")}
                      placeholder="mm/dd/yyyy"
                      variant="underlined"
                      labelPlacement="outside"
                      classNames={{
                        label: "text-primary opacity-100 font-bold",
                      }}
                    />
                  </div>
                  <div className="p-4 ">
                    <Input
                      type="date"
                      label="Fecha de expiración"
                      isRequired
                      {...register("passport_expiration")}
                      placeholder="mm/dd/yyyy"
                      variant="underlined"
                      labelPlacement="outside"
                      classNames={{
                        label: "text-primary opacity-100 font-bold",
                      }}
                    />
                  </div>
                </div>

                <div
                  id="educacion"
                  className="grid grid-cols-1 gap-3 border-2 border-primary/50 rounded-lg"
                >
                  <div className=" border-b-2 border-primary/50  p-4">
                    <h1>Educación</h1>
                  </div>

                  <div className="p-4 text-medium font-normal">
                    <p>
                      Debe tener un mínimo de titulo de educación secundaria
                      culminado (escuela de vocacion o equivalente) ó demostrar
                      ser un trabajador con habilidades que requieren al menos 2
                      años de entrenamiento o experiencia laboral.
                    </p>
                  </div>
                  <div className="p-4 ">
                    <Select
                      isRequired
                      labelPlacement="outside"
                      label="Nivel de educación más alto obtenido"
                      {...register("education")}
                      placeholder="Seleccione una opción"
                      variant="underlined"
                      className="max-w-xs"
                      classNames={{
                        label: "text-primary opacity-100 font-bold",
                      }}
                    >
                      <SelectItem value={"primaria"} key="primaria">
                        {"Primaria"}
                      </SelectItem>
                      <SelectItem value={"secundaria"} key="secundaria">
                        {"Secundaria"}
                      </SelectItem>
                      <SelectItem value={"universidad"} key="universidad">
                        {"Universidad"}
                      </SelectItem>
                      <SelectItem value={"universidad_st"} key="universidad_st">
                        {"Universidad (sin título)"}
                      </SelectItem>
                      <SelectItem value={"maestria"} key="maestria">
                        {"Maestría"}
                      </SelectItem>
                      <SelectItem value={"doctorado"} key="doctorado">
                        {"Doctorado"}
                      </SelectItem>
                    </Select>
                  </div>
                </div>

                {estadoCivil === "casado" && (
                  <div
                    id="nombres_completos_conyugue"
                    className="grid grid-cols-3 gap-3 border-2 border-primary/50 rounded-lg"
                  >
                    <div className="col-span-3 border-b-2 border-primary/50  p-4">
                      <h1>Datos del conyugue</h1>
                    </div>

                    <div className="p-4 col-span-3 text-medium  ">
                      Nota: Colocar nombres y apellidos como se muestran en su
                      documento de identidad.
                    </div>
                    <div className="p-4 ">
                      <Input
                        type="text"
                        size="lg"
                        isRequired
                        variant="underlined"
                        label="Primer nombre"
                        {...register("first_name_conyugue")}
                        labelPlacement="outside"
                        placeholder="MARIA"
                        classNames={{
                          label: labelsStyle,
                          input: inputStyle,
                        }}
                      />
                    </div>
                    <div className="p-4 ">
                      <Input
                        type="text"
                        size="lg"
                        isRequired
                        variant="underlined"
                        label="Segundo nombre"
                        {...register("second_name_conyugue")}
                        labelPlacement="outside"
                        placeholder="CARLA"
                        classNames={{
                          label: labelsStyle,
                          input: inputStyle,
                        }}
                      />
                    </div>
                    <div className="p-4 ">
                      <Input
                        size="lg"
                        type="text"
                        isRequired
                        variant="underlined"
                        {...register("apellidos_conyugue")}
                        label="Apellidos"
                        labelPlacement="outside"
                        placeholder="VERA MOREIRA"
                        classNames={{
                          label: labelsStyle,
                          input: inputStyle,
                        }}
                      />
                    </div>

                    <div className="p-4 col-end-2">
                      <Input
                        type="number"
                        label="No. Pasaporte/ID"
                        isRequired
                        {...register("passport_conyugue")}
                        placeholder="xxxxxxxxxx"
                        variant="underlined"
                        labelPlacement="outside"
                        classNames={{
                          label: labelsStyle,
                          input: inputStyle,
                        }}
                      />
                    </div>
                    <div className="p-4 col-start-1">
                      <Input
                        type="date"
                        label="Fecha de emisión"
                        isRequired
                        {...register("passport_emision_conyugue")}
                        placeholder="mm/dd/yyyy"
                        variant="underlined"
                        labelPlacement="outside"
                        classNames={{
                          label: "text-primary opacity-100 font-bold",
                        }}
                      />
                    </div>
                    <div className="p-4 ">
                      <Input
                        type="date"
                        label="Fecha de expiración"
                        isRequired
                        {...register("passport_expiration_conyugue")}
                        placeholder="mm/dd/yyyy"
                        variant="underlined"
                        labelPlacement="outside"
                        classNames={{
                          label: "text-primary opacity-100 font-bold",
                        }}
                      />
                    </div>
                  </div>
                )}

                {haveKids && (
                  <div
                    id="datos_hijos"
                    className="flex flex-col flex-nowrap gap-3 border-2 border-primary/50 rounded-lg"
                  >
                    <div className="border-b-2 border-primary/50  p-4">
                      <h1>Datos de sus hijos</h1>
                    </div>

                    <div className="p-4 text-medium font-normal">
                      <p>
                        <span className="text-warning">Importante!</span> Debe
                        incluir a todos sus hijos biologicos, adoptados,
                        hijastros/as solteros menores a 21 años a partir del dia
                        del registro de esta aplicacion. Debe incluir hijos que
                        viven y que no viven con usted, ademas hijos que aun
                        despues de ser acreedores a la loteria no deseen viajar
                        a los Estados Unidos con usted.
                      </p>
                      <p className="my-4">
                        Dar click en el botón{" "}
                        <span>
                          <PersonAdd className="h-5 aspect-w-1" />
                        </span>{" "}
                        para agregar otro hij@.
                      </p>
                    </div>

                    {fields.map((field, index) => {
                      return (
                        <>
                          <div
                            key={field.id}
                            className="p-4  grid grid-cols-4 gap-5"
                          >
                            <div className="col-span-2">
                              <Input
                                type="text"
                                size="lg"
                                isRequired
                                variant="underlined"
                                label="Primer nombre"
                                {...register(
                                  `children.${index}.first_name` as const
                                )}
                                labelPlacement="outside"
                                placeholder="JORGE"
                                classNames={{
                                  label: labelsStyle,
                                  input: inputStyle,
                                }}
                              />
                            </div>
                            <div className="col-span-2">
                              <Input
                                type="text"
                                size="lg"
                                isRequired
                                variant="underlined"
                                label="Segundo nombre"
                                {...register(
                                  `children.${index}.second_name` as const
                                )}
                                labelPlacement="outside"
                                placeholder="CARLOS"
                                classNames={{
                                  label: labelsStyle,
                                  input: inputStyle,
                                }}
                              />
                            </div>

                            <div className="col-span-2">
                              <Input
                                size="lg"
                                type="text"
                                isRequired
                                variant="underlined"
                                {...register(
                                  `children.${index}.apellidos` as const
                                )}
                                label="Apellidos"
                                labelPlacement="outside"
                                placeholder="CRUZ TAPIA"
                                classNames={{
                                  label: labelsStyle,
                                  input: inputStyle,
                                }}
                              />
                            </div>
                            <Input
                              size="lg"
                              type="number"
                              isRequired
                              variant="underlined"
                              {...register(`children.${index}.edad` as const)}
                              label="Edad"
                              labelPlacement="outside"
                              placeholder="5 años"
                              classNames={{
                                label: labelsStyle,
                                input: inputStyle,
                              }}
                            />
                            <button onClick={() => remove(index)}>
                              <PersonDelete className="h-10 aspect-w-1" />
                            </button>
                          </div>
                          <Divider className="mb-4" />
                        </>
                      );
                    })}

                    <div className="p-4 text-medium flex relative justify-center">
                      <button
                        color="primary"
                        onClick={() =>
                          append({
                            first_name: "nombre",
                            second_name: "nombre",
                            apellidos: "apellido",
                            edad: 6,
                          })
                        }
                      >
                        <PersonAdd className="h-12 aspect-w-1" />
                      </button>
                    </div>
                  </div>
                )}

                <div
                  id="fot_visa"
                  className="flex flex-col items-center gap-3 border-2 border-primary/50 rounded-lg"
                >
                  <div className=" border-b-2 border-primary/50  p-4 w-full ">
                    <h1>Foto visa</h1>
                  </div>

                  <div className="p-4 gap-4 text-medium w-full text-center">
                    <h1> Requisitos </h1>
                    <p className="font-normal">
                      Cargar fotografias en formato .jpg tamaño 5x5 cm fondo
                      blanco.{" "}
                    </p>
                  </div>
                  <div className="flex relative w-96 h-96">
                    <Image
                      src="./pictures/req_foto_visa.jpeg"
                      fill
                      alt={"requirements visa photo"}
                    />
                  </div>

                  <div className="p-4 text-center">
                    <div className="text-medium my-4">Aplicante</div>
                    <Skeleton
                      isLoaded={createObjectURLs["aplicante"] != null}
                      className="w-96 h-96  flex relative"
                    >
                      {createObjectURLs["aplicante"] && (
                        <Image
                          src={createObjectURLs["aplicante"]}
                          fill
                          alt={"visa photo"}
                        />
                      )}
                    </Skeleton>

                    <div className="w-fullh-fit my-4">
                      <Input
                        type="file"
                        //label="Upload photo"
                        isRequired
                        {...register("foto_aplicante", {
                          onChange: (e) => uploadToClient(e, 0, "aplicante"),
                        })}
                        accept=".jpg, .jpeg, .png"
                        //placeholder="mm/dd/yyyy"
                        variant="underlined"
                        labelPlacement="outside"
                        classNames={{
                          label: "text-primary opacity-100 font-bold",
                        }}
                      />
                    </div>
                  </div>

                  {estadoCivil === "casado" && (
                    <div className="p-4 text-center">
                      <div className="text-medium my-4">Conyugue</div>
                      <Skeleton
                        isLoaded={createObjectURLs["conyugue"] != null}
                        className="w-[300px] h-[300px]  flex relative"
                      >
                        {createObjectURLs["conyugue"] && (
                          <Image
                            src={createObjectURLs["conyugue"]}
                            fill
                            alt={"visa photo"}
                          />
                        )}
                      </Skeleton>

                      <div className="w-fullh-fit my-4">
                        <Input
                          type="file"
                          isRequired
                          {...register("foto_conyugue", {
                            onChange: (e) => uploadToClient(e, 0, "conyugue"),
                          })}
                          accept=".jpg, .jpeg, .png"
                          //placeholder="mm/dd/yyyy"
                          variant="underlined"
                          labelPlacement="outside"
                          classNames={{
                            label: "text-primary opacity-100 font-bold",
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {haveKids &&
                    fields.map((field, index) => {
                      return (
                        <div key={field.id} className="p-4 text-center">
                          <div className="text-medium my-4">{`Carga #${
                            index + 1
                          }`}</div>
                          <Skeleton
                            isLoaded={createObjectURLs[`kid_${index}`] != null}
                            className="w-[300px] h-[300px]  flex relative"
                          >
                            {createObjectURLs[`kid_${index}`] && (
                              <Image
                                src={createObjectURLs[`kid_${index}`]!}
                                fill
                                alt={"visa photo"}
                              />
                            )}
                          </Skeleton>

                          <div key={field.id} className="w-fullh-fit my-4">
                            <Input
                              type="file"
                              //label="Upload photo"
                              isRequired
                              onChange={(e) => uploadToClient(e, index, "kid")}
                              accept=".jpg, .jpeg, .png"
                              //placeholder="mm/dd/yyyy"
                              variant="underlined"
                              labelPlacement="outside"
                              classNames={{
                                label: "text-primary opacity-100 font-bold",
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>

                <div className="w-fit h-fit flex relative justify-self-center mt-10">
                  <Checkbox
                    isSelected={acceptPolitics}
                    onValueChange={setAcceptPolitics}
                  >
                    <Link onClick={onOpen}>POLITICA DE CONFIDENCIALIDAD</Link>
                  </Checkbox>
                </div>

                <div className="w-fit h-fit flex relative justify-self-center">
                  <Button
                    color="primary"
                    type="submit"
                    isLoading={isSubmitting}
                    isDisabled={!acceptPolitics}
                  >
                    {isSubmitting ? "Loading" : "Enviar"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          size="sm"
          backdrop="blur"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  {typeWarning == "warning"
                    ? "Warning: Image out of size limits."
                    : "POLITICA DE CONFIDENCIALIDAD"}
                </ModalHeader>
                <ModalBody>
                  <p>
                    {typeWarning == "warning"
                      ? "La imagen subida tiene un tamaño mayor a 1mb. Se recomienda verificar el tamaño del archivo. Si continua teniendo problemas subiendo las fotos, contactarse por interno."
                      : "La informacion ingresada es requerida segun la seccion 222 del acto de imigracion nacional de los Estados Unidos INA seccion 222(f). Sus datos seran confidenciales y seran utilizados unica y exclusivamente para la formulacion, administracion o implementacion de la imigracion, nacionalidad y otras leyes de los Estados Unidos. Sus datos NO seran compartidos con ninguna otra empresa, corporacion, fundacion o tercera persona."}
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="danger"
                    variant="light"
                    onPress={() => {
                      setTypeWarning("politics");
                      onClose();
                    }}
                  >
                    Cerrar
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}
