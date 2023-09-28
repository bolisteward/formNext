"use client";

import { Metadata } from "next";

import { Divider, Input, Switch, Button, Skeleton } from "@nextui-org/react";

import Image from "next/image";
import { SubmitHandler, useForm } from "react-hook-form";
import { IFormSearch, KidSearch, NivelEducacion } from "@typesApp/index";
import { useState } from "react";
import { Man, Woman } from "@styled-icons/ionicons-solid";

import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import es from "react-phone-number-input/locale/es";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function Page() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<IFormSearch>();

  const [sexo, setSexo] = useState<string | null>(null);
  const [estadoCivil, setEstadoCivil] = useState<string | null>(null);
  const [kids, setKids] = useState<KidSearch[] | null>(null);
  const [fotoCo, setFotoCo] = useState<string[] | null>(null);
  const [fotoAp, setFotoAp] = useState<string[] | null>(null);

  const labelsStyle = "text-primary font-bold text-sm md:text-medium";
  const inputStyle =
    "bg-transparent text-primary/90 text-sm md:text-medium placeholder:text-primary/50 ";
  const componentStyle = "p-2 md:p-4";

  const onSubmit: SubmitHandler<IFormSearch> = async (data: IFormSearch) => {
    try {
      const url = new URL("https://form.visaglobal.com.ec/register/");
      url.searchParams.append("names", data.names_search.toUpperCase());
      url.searchParams.append("surnames", data.surnames_search.toUpperCase());

      const forminfo = await fetch(url.toString(), {
        method: "GET",
      });

      /*
      const url = new URL("http://localhost:3000/api/getdata/");
      url.searchParams.append("names", data.names_search.toUpperCase());
      url.searchParams.append("surnames", data.surnames_search.toUpperCase());
  
      const forminfo = await fetch(url.toString());
      */

      if (!forminfo.ok) {
        throw new Error("No se pudo obtener la respuesta de la API");
      }

      const aplicante_data = await forminfo.json();

      setValue("first_name", aplicante_data.aplicante.names.split(" ")[0]);
      setValue(
        "second_name",
        aplicante_data.aplicante.names.split(" ")[1] ?? ""
      );
      setValue("apellidos", aplicante_data.aplicante.surnames);
      setSexo(aplicante_data.aplicante.sexo);
      setValue("estado_civil", aplicante_data.aplicante.civil_status);
      setEstadoCivil(aplicante_data.aplicante.civil_status);

      setValue("fecha_nacimiento", aplicante_data.aplicante.birth_date);
      setValue("ciudad_nacimiento", aplicante_data.aplicante.birth_city);
      setValue("pais_nacimiento", aplicante_data.aplicante.birth_country);
      setValue("pais_residencia", aplicante_data.aplicante.residence_country);
      setValue("direccion", aplicante_data.aplicante.address);

      setValue("phone", aplicante_data.aplicante.phone);
      setValue("email", aplicante_data.aplicante.email);
      setValue("passport", aplicante_data.aplicante.passport);
      setValue("passport_emision", aplicante_data.aplicante.passport_emision);
      setValue(
        "passport_expiration",
        aplicante_data.aplicante.passport_expiration
      );
      setValue(
        "education",
        aplicante_data.aplicante.education as NivelEducacion
      );
      setFotoAp([
        aplicante_data.aplicante.foto_url,
        aplicante_data.aplicante.foto_url_pss,
      ]);

      if (aplicante_data.aplicante.civil_status === "casado") {
        setValue(
          "first_name_conyugue",
          aplicante_data.familiares.conyugue.names.split(" ")[0]
        );
        setValue(
          "second_name_conyugue",
          aplicante_data.familiares.conyugue.names.split(" ")[1] ?? ""
        );
        setValue(
          "apellidos_conyugue",
          aplicante_data.familiares.conyugue.surnames
        );
        setValue(
          "passport_conyugue",
          aplicante_data.familiares.conyugue.passport
        );
        setValue(
          "passport_emision_conyugue",
          aplicante_data.familiares.conyugue.passport_emision
        );
        setValue(
          "passport_expiration_conyugue",
          aplicante_data.familiares.conyugue.passport_expiration
        );
        setFotoCo([
          aplicante_data.familiares.conyugue.foto_url,
          aplicante_data.familiares.conyugue.foto_url_pss,
        ]);
      }

      if (aplicante_data.aplicante.children > 0) {
        const listKids: KidSearch[] = aplicante_data.familiares.hijos.map(
          (kid: any) => ({
            first_name: kid.names.split(" ")[0],
            second_name: kid.names.split(" ")[1] ?? "",
            apellidos: kid.surnames,
            edad: kid.edad,
            foto_kid: kid.foto_url,
            foto_kid_pss: kid.foto_url_pss,
          })
        );
        setKids(listKids);
      }
    } catch (error) {
      alert("Error while sending form, please try one more time!");
      console.error("Error al llamar a la API:", error);
    }
  };

  return (
    <div
      id="in_body"
      className="flex relative w-screen h-fit bg-background justify-center overflow-x-hidden"
    >
      <div className="flex absolute w-full h-full opacity-70 bg-gradient-to-r from-blue-200 via-sky-800 to-sky-200 "></div>

      <div
        id="Page2"
        className="flex relative flex-col z-0 md:w-3/4 w-5/6 items-center"
      >
        <div
          id="logo"
          className="flex z-10  relative my-unit-md w-full aspect-w-4 md:aspect-w-6  aspect-h-1 "
        >
          <Image
            src="/pictures/logo/logo-long-ai-blanco.png"
            alt="logo"
            fill
            style={{ objectFit: "contain" }}
          />
        </div>

        <div
          id="Dashboard"
          className="flex relative w-full md:w-4/5 h-full text-sm md:text-xl text-secondary font-bold mb-unit-3xl"
        >
          <div className="flex absolute -z-30 w-full h-full bg-white border-2 border-primary/70 rounded-medium"></div>

          <div className="flex flex-col text-primary w-full">
            <div className="mb-4">
              <h1 className="text-2xl md:text-4xl flex w-full h-auto justify-center my-5 md:my-10 ">
                Visa Form
              </h1>
            </div>
            <div className="mb-4 p-unit-md md:p-unit-xl ">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid grid-cols-1 gap-5  "
              >
                <Divider className="bg-primary" />

                <div
                  id="buscador"
                  className="grid grid-flow-row md:grid-cols-2 gap-1 pb-4"
                >
                  <div className="md:col-span-2 p-2 md:p-4 text-center">
                    <h1>Buscar aplicante</h1>
                  </div>

                  <div className="px-2 md:px-4 md:col-span-2 text-sm md:text-medium font-normal ">
                    Nota: Buscar por nombres completos o apellidos.
                  </div>
                  <div className={componentStyle}>
                    <Input
                      type="text"
                      size="lg"
                      variant="underlined"
                      label="Nombres"
                      {...register("names_search")}
                      labelPlacement="outside"
                      placeholder="JORGE CARLOS"
                      classNames={{
                        label: labelsStyle,
                        input: inputStyle,
                      }}
                    />
                  </div>
                  <div className={componentStyle}>
                    <Input
                      size="lg"
                      type="text"
                      isRequired
                      variant="underlined"
                      {...register("surnames_search")}
                      label="Apellidos"
                      labelPlacement="outside"
                      placeholder="CRUZ VELEZ"
                      classNames={{
                        label: labelsStyle,
                        input: inputStyle,
                      }}
                    />
                  </div>

                  <div className={`${componentStyle} `}>
                    <Button
                      color="primary"
                      type="submit"
                      size="md"
                      isLoading={isSubmitting}
                      className="text-sm md:text-medium font-bold"
                    >
                      {isSubmitting ? "Searching" : "Search"}
                    </Button>
                  </div>
                </div>
                <Divider className="bg-primary mb-4" />

                <div
                  id="nombres_completos"
                  className="grid grid-flow-row md:grid-cols-3 gap-3 border-2 border-primary/50 rounded-lg pb-4"
                >
                  <div className="md:col-span-3 border-b-2 border-primary/50 p-2 md:p-4">
                    <h1>Nombres completos</h1>
                  </div>

                  <div className={componentStyle}>
                    <Input
                      type="text"
                      size="lg"
                      readOnly
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
                  <div className={componentStyle}>
                    <Input
                      type="text"
                      size="lg"
                      readOnly
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
                  <div className={componentStyle}>
                    <Input
                      size="lg"
                      type="text"
                      readOnly
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
                  className="grid grid-flow-row md:grid-cols-2 gap-3 border-2 border-primary/50 rounded-lg pb-4"
                >
                  <div
                    className={`md:col-span-2 border-b-2 border-primary/50 ${componentStyle}`}
                  >
                    <h1>Género</h1>
                  </div>
                  <div className={componentStyle}>
                    {sexo === "hombre" ? (
                      <div className="flex flex-row flex-nowrap items-center text-sm md:text-medium text-primary">
                        <Man className="h-6 md:h-8 aspect-w-1" />
                        <span>Masculino</span>
                      </div>
                    ) : (
                      <div className="flex flex-row flex-nowrap items-center text-sm md:text-medium text-pink-400">
                        <Woman className="h-6 md:h-8 aspect-w-1" />
                        <span>Femenino</span>
                      </div>
                    )}
                  </div>
                </div>

                <div
                  id="estado_civil"
                  className="grid grid-flow-row md:grid-cols-2 gap-3 border-2 border-primary/50 rounded-lg pb-4"
                >
                  <div
                    className={`md:col-span-2 border-b-2 border-primary/50 ${componentStyle}`}
                  >
                    <h1>Estado civil</h1>
                  </div>

                  <div className={componentStyle}>
                    <Input
                      size="lg"
                      type="text"
                      readOnly
                      variant="underlined"
                      {...register("estado_civil")}
                      label="Estado Civil"
                      labelPlacement="outside"
                      placeholder="soltero"
                      classNames={{
                        label: labelsStyle,
                        input: inputStyle,
                      }}
                    />
                  </div>

                  <div className={componentStyle}>
                    <div className="text-sm md:text-medium mb-3">
                      <h3 className="after:content-['*'] after:text-danger after:ml-0.5">
                        Tiene hijos?
                      </h3>
                    </div>
                    <Switch
                      isSelected={kids ? kids.length > 0 : false}
                      aria-label="Automatic updates"
                    />
                  </div>
                </div>

                <div
                  id="fecha_nac"
                  className="grid grid-flow-row md:grid-cols-2 gap-3 border-2 border-primary/50 rounded-lg pb-4"
                >
                  <div
                    className={`md:col-span-2 border-b-2 border-primary/50 ${componentStyle}`}
                  >
                    <h1>Fecha de nacimiento</h1>
                  </div>
                  <div className={componentStyle}>
                    <Input
                      size="lg"
                      type="date"
                      readOnly
                      variant="underlined"
                      label="Fecha"
                      {...register("fecha_nacimiento")}
                      labelPlacement="outside"
                      placeholder="mm/dd/yyyy"
                      classNames={{
                        label: labelsStyle,
                        input: inputStyle,
                      }}
                    />
                  </div>
                </div>

                <div
                  id="lugar_nac"
                  className="grid grid-flow-row md:grid-cols-2 gap-3 border-2 border-primary/50 rounded-lg pb-4"
                >
                  <div
                    className={`md:col-span-2 border-b-2 border-primary/50 ${componentStyle}`}
                  >
                    <h1>Lugar de nacimiento</h1>
                  </div>

                  <div className={componentStyle}>
                    <Input
                      size="lg"
                      type="text"
                      variant="underlined"
                      readOnly
                      label="Ciudad de nacimiento"
                      {...register("ciudad_nacimiento")}
                      labelPlacement="outside"
                      placeholder="Ciudad"
                      classNames={{
                        label: labelsStyle,
                        input: inputStyle,
                      }}
                    />
                  </div>
                  <div className={componentStyle}>
                    <Input
                      size="lg"
                      type="text"
                      readOnly
                      variant="underlined"
                      label="Pais de nacimiento"
                      {...register("pais_nacimiento")}
                      labelPlacement="outside"
                      placeholder="Pais"
                      classNames={{
                        label: labelsStyle,
                        input: inputStyle,
                      }}
                    />
                  </div>

                  <div className={componentStyle}>
                    <Input
                      size="lg"
                      type="text"
                      readOnly
                      variant="underlined"
                      label="Pais de recidencia"
                      {...register("pais_residencia")}
                      labelPlacement="outside"
                      placeholder="Pais"
                      classNames={{
                        label: labelsStyle,
                        input: inputStyle,
                      }}
                    />
                  </div>

                  <div className={`md:col-span-2 ${componentStyle}`}>
                    <Input
                      type="text"
                      size="lg"
                      label="Dirección"
                      readOnly
                      {...register("direccion")}
                      placeholder="Calle, Mz #, Villa #, etc."
                      variant="underlined"
                      labelPlacement="outside"
                      classNames={{
                        label: labelsStyle,
                        input: inputStyle,
                      }}
                    />
                  </div>
                </div>

                <div
                  id="contacto"
                  className="grid grid-flow-row md:grid-cols-2 gap-3 border-2 border-primary/50 rounded-lg pb-4"
                >
                  <div
                    className={`md:col-span-2 border-b-2 border-primary/50 ${componentStyle}`}
                  >
                    <h1>Contacto</h1>
                  </div>
                  <div className={componentStyle}>
                    <div className="text-primary text-sm md:text-medium opacity-100 font-bold pb-2">
                      Número telefónico
                    </div>

                    <PhoneInput
                      international
                      defaultCountry="EC"
                      labels={es}
                      limitMaxLength
                      countryCallingCodeEditable={false}
                      placeholder="Enter phone number"
                      {...register("phone", {
                        required: true,
                      })}
                      onChange={(e) => {}}
                      className="font-light border-b-2 text-md pt-2 hover:border-"
                    />
                  </div>
                  <div className={componentStyle}>
                    <Input
                      type="email"
                      label="Email"
                      readOnly
                      {...register("email")}
                      placeholder="you@example.com"
                      variant="underlined"
                      labelPlacement="outside"
                      classNames={{
                        label: labelsStyle,
                        input: inputStyle,
                      }}
                    />
                  </div>
                </div>

                <div
                  id="identidad"
                  className="grid grid-flow-row md:grid-cols-2 gap-3 border-2 border-primary/50 rounded-lg pb-4"
                >
                  <div
                    className={`md:col-span-2 border-b-2 border-primary/50 ${componentStyle}`}
                  >
                    <h1>Documento de identidad</h1>
                  </div>
                  <div className={`md:col-span-2 ${componentStyle}`}>
                    <Input
                      type="text"
                      label="No. Pasaporte/ID"
                      readOnly
                      {...register("passport", {})}
                      placeholder="xxxxxxxxxx"
                      variant="underlined"
                      labelPlacement="outside"
                      classNames={{
                        label: labelsStyle,
                        input: inputStyle,
                      }}
                    />
                  </div>
                  <div className={componentStyle}>
                    <Input
                      type="date"
                      label="Fecha de emisión"
                      readOnly
                      {...register("passport_emision")}
                      placeholder="mm/dd/yyyy"
                      variant="underlined"
                      labelPlacement="outside"
                      classNames={{
                        label: labelsStyle,
                        input: inputStyle,
                      }}
                    />
                  </div>
                  <div className={componentStyle}>
                    <Input
                      type="date"
                      label="Fecha de expiración"
                      readOnly
                      {...register("passport_expiration")}
                      placeholder="mm/dd/yyyy"
                      variant="underlined"
                      labelPlacement="outside"
                      classNames={{
                        label: labelsStyle,
                        input: inputStyle,
                      }}
                    />
                  </div>
                </div>

                <div
                  id="educacion"
                  className="grid grid-cols-1 gap-3 border-2 border-primary/50 rounded-lg pb-4"
                >
                  <div
                    className={`border-b-2 border-primary/50 ${componentStyle}`}
                  >
                    <h1>Educación</h1>
                  </div>

                  <div className={componentStyle}>
                    <Input
                      type="text"
                      label="Nivel de educación más alto obtenido"
                      readOnly
                      {...register("education")}
                      placeholder="educación"
                      variant="underlined"
                      labelPlacement="outside"
                      classNames={{
                        label: labelsStyle,
                        input: inputStyle,
                      }}
                    />
                  </div>
                </div>

                {estadoCivil === "casado" && (
                  <div
                    id="nombres_completos_conyugue"
                    className="grid grid-flow-row md:grid-cols-3 gap-3 border-2 border-primary/50 rounded-lg pb-4"
                  >
                    <div
                      className={`md:col-span-3 border-b-2 border-primary/50 ${componentStyle}`}
                    >
                      <h1>Datos del conyugue</h1>
                    </div>

                    <div className={componentStyle}>
                      <Input
                        type="text"
                        size="lg"
                        readOnly
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
                    <div className={componentStyle}>
                      <Input
                        type="text"
                        size="lg"
                        readOnly
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
                    <div className={componentStyle}>
                      <Input
                        size="lg"
                        type="text"
                        readOnly
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

                    <div className={`${componentStyle} md:col-end-2`}>
                      <Input
                        type="number"
                        label="No. Pasaporte/ID"
                        readOnly
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
                    <div className={`col-start-1 ${componentStyle}`}>
                      <Input
                        type="date"
                        label="Fecha de emisión"
                        readOnly
                        {...register("passport_emision_conyugue")}
                        placeholder="mm/dd/yyyy"
                        variant="underlined"
                        labelPlacement="outside"
                        classNames={{
                          label: labelsStyle,
                          input: inputStyle,
                        }}
                      />
                    </div>
                    <div className={componentStyle}>
                      <Input
                        type="date"
                        label="Fecha de expiración"
                        readOnly
                        {...register("passport_expiration_conyugue")}
                        placeholder="mm/dd/yyyy"
                        variant="underlined"
                        labelPlacement="outside"
                        classNames={{
                          label: labelsStyle,
                          input: inputStyle,
                        }}
                      />
                    </div>
                  </div>
                )}

                {kids && kids.length > 0 && (
                  <div
                    id="datos_hijos"
                    className="flex flex-col flex-nowrap gap-3 border-2 border-primary/50 rounded-lg pb-4"
                  >
                    <div
                      className={`border-b-2 border-primary/50 ${componentStyle}`}
                    >
                      <h1>Datos de sus hijos</h1>
                    </div>

                    {kids.map((kid, index) => {
                      return (
                        <div key={index}>
                          <div
                            className={`grid grid-flow-row md:grid-cols-4 gap-5 ${componentStyle}`}
                          >
                            <div className="md:col-span-2">
                              <Input
                                type="text"
                                size="lg"
                                readOnly
                                variant="underlined"
                                label="Primer nombre"
                                value={kid.first_name}
                                labelPlacement="outside"
                                placeholder="JORGE"
                                classNames={{
                                  label: labelsStyle,
                                  input: inputStyle,
                                }}
                              />
                            </div>
                            <div className="md:col-span-2">
                              <Input
                                type="text"
                                size="lg"
                                readOnly
                                variant="underlined"
                                label="Segundo nombre"
                                value={kid.second_name}
                                labelPlacement="outside"
                                placeholder="CARLOS"
                                classNames={{
                                  label: labelsStyle,
                                  input: inputStyle,
                                }}
                              />
                            </div>

                            <div className="md:col-span-2">
                              <Input
                                size="lg"
                                type="text"
                                readOnly
                                variant="underlined"
                                value={kid.apellidos}
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
                              readOnly
                              variant="underlined"
                              value={kid.edad}
                              label="Edad"
                              labelPlacement="outside"
                              placeholder="5 años"
                              classNames={{
                                label: labelsStyle,
                                input: inputStyle,
                              }}
                            />
                          </div>
                          <Divider className="mb-4" />
                        </div>
                      );
                    })}
                  </div>
                )}

                <div
                  id="foto_visa"
                  className="flex flex-col items-center gap-3 border-2 border-primary/50 rounded-lg pb-4"
                >
                  <div
                    className={`border-b-2 border-primary/50 w-full ${componentStyle}`}
                  >
                    <h1>Foto visa</h1>
                  </div>

                  <div
                    className={`grid grid-flow-row md:grid-cols-2 gap-3 text-center ${componentStyle}`}
                  >
                    <div className="md:col-span-2 text-medium md:text-xl my-4">
                      Aplicante
                    </div>
                    <div className="flex flex-col md:mr-5">
                      <h1 className="mb-8">Foto tipo visa</h1>
                      <Skeleton
                        isLoaded={(fotoAp && fotoAp[0]) != null}
                        className=" w-52 h-52 md:w-72 md:h-72 flex relative  mx-auto"
                      >
                        <Image
                          src={(fotoAp && fotoAp[0]) ?? "../uploads/foto.jpg"}
                          fill
                          alt={"visa photo"}
                        />
                      </Skeleton>
                    </div>

                    <div className="flex flex-col md:ml-5">
                      <h1 className="mb-8">Foto Pasaporte / cédula</h1>
                      <Skeleton
                        isLoaded={(fotoAp && fotoAp[1]) != null}
                        className=" w-52 h-52 md:w-72 md:h-72 flex relative  mx-auto"
                      >
                        <Image
                          src={(fotoAp && fotoAp[1]) ?? "../uploads/foto.jpg"}
                          fill
                          alt={"visa photo ID"}
                        />
                      </Skeleton>
                    </div>
                  </div>

                  {estadoCivil === "casado" && (
                    <div
                      className={`text-center grid grid-flow-row md:grid-cols-2 gap-3 ${componentStyle}`}
                    >
                      <div className="md:col-span-2 text-medium md:text-xl my-4">
                        Conyugue
                      </div>
                      <div className="flex flex-col md:mr-5">
                        <h1 className="mb-8">Foto tipo visa</h1>
                        <Skeleton
                          isLoaded={(fotoCo && fotoCo[0]) != null}
                          className="w-52 h-52 md:w-72 md:h-72 flex relative  mx-auto"
                        >
                          <Image
                            src={(fotoCo && fotoCo[0]) ?? "../uploads/foto.jpg"}
                            fill
                            alt={"visa photo"}
                          />
                        </Skeleton>
                      </div>
                      <div className="flex flex-col md:ml-5">
                        <h1 className="mb-8">Foto Pasaporte / cédula</h1>
                        <Skeleton
                          isLoaded={(fotoCo && fotoCo[1]) != null}
                          className="w-52 h-52 md:w-72 md:h-72 flex relative  mx-auto"
                        >
                          <Image
                            src={(fotoCo && fotoCo[1]) ?? "../uploads/foto.jpg"}
                            fill
                            alt={"visa photo"}
                          />
                        </Skeleton>
                      </div>
                    </div>
                  )}

                  {kids &&
                    kids.length > 0 &&
                    kids.map((kid, index) => {
                      return (
                        <div
                          key={index}
                          className={`grid grid-flow-row md:grid-cols-2 gap-3 text-center ${componentStyle}`}
                        >
                          <div className="md:col-span-2 text-medium md:text-xl my-4">
                            {`Carga #${index + 1}`}
                          </div>

                          <div className="flex flex-col md:mr-5">
                            <h1 className="mb-8">Foto tipo visa</h1>
                            <Skeleton
                              isLoaded={kid.foto_kid != null}
                              className="w-52 h-52 md:w-72 md:h-72 flex relative  mx-auto"
                            >
                              <Image
                                src={kid.foto_kid}
                                fill
                                alt={"visa photo"}
                              />
                            </Skeleton>
                          </div>
                          <div className="flex flex-col md:ml-5">
                            <h1 className="mb-8">Foto Pasaporte / cédula</h1>
                            <Skeleton
                              isLoaded={kid.foto_kid_pss != null}
                              className="w-52 h-52 md:w-72 md:h-72 flex relative  mx-auto"
                            >
                              <Image
                                src={kid.foto_kid_pss}
                                fill
                                alt={"visa photo"}
                              />
                            </Skeleton>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
