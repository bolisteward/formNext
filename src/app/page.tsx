"use client";
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
  Spacer,
} from "@nextui-org/react";

import Image from "next/image";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { onSubmit } from "./actions";
import { IFormInput } from "@typesApp/index";
import { useEffect, useMemo, useState } from "react";
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
    reset,
    formState: { isSubmitting, isSubmitSuccessful },
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
  const [closePage, setClosePage] = useState<boolean>(false);
  const [typeWarning, setTypeWarning] = useState<"politics" | "warning">(
    "politics"
  );
  const { fields, append, remove } = useFieldArray({
    name: "children",
    control,
  });

  const labelsStyle = "text-primary font-bold text-sm md:text-medium";
  const inputStyle =
    "bg-transparent text-primary/90 text-sm md:text-medium placeholder:text-primary/50 ";
  const componentStyle = "p-2 md:p-4";

  const validateEmail = (value: string) =>
    value.match(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/);

  const ValidatePassport = (value: string) => value.match(/^\d{10}$/);

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
        switch (typePerson) {
          case "aplicante":
            setValue("foto_aplicante", null);
            break;
          case "aplicanteID":
            setValue("foto_aplicante_id", null);
            break;
          case "conyugue":
            setValue("foto_conyugue", null);
            break;
          case "conyugueID":
            setValue("foto_conyugue_id", null);
            break;
          case "kid":
            setValue(`children.${index}.foto_kid`, null);

            break;
          case "kidID":
            setValue(`children.${index}.foto_kid_id`, null);
            break;

          default:
            break;
        }

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
        case "aplicanteID":
          setCreateObjectURLs((prevURLs) => ({
            ...prevURLs,
            ["aplicanteID"]: URL.createObjectURL(photofile[0]),
          }));
          break;
        case "conyugue":
          setCreateObjectURLs((prevURLs) => ({
            ...prevURLs,
            ["conyugue"]: URL.createObjectURL(photofile[0]),
          }));
          break;
        case "conyugueID":
          setCreateObjectURLs((prevURLs) => ({
            ...prevURLs,
            ["conyugueID"]: URL.createObjectURL(photofile[0]),
          }));
          break;

        case "kid":
          //setValue(`children.${index}.foto_kid`, photofile);
          setCreateObjectURLs((prevURLs) => ({
            ...prevURLs,
            [`kid_${index}`]: URL.createObjectURL(photofile[0]),
          }));
          break;
        case "kidID":
          //setValue(`children.${index}.foto_kid_id`, photofile);
          setCreateObjectURLs((prevURLs) => ({
            ...prevURLs,
            [`kidID_${index}`]: URL.createObjectURL(photofile[0]),
          }));
          break;

        default:
          break;
      }
    }
  };

  const passportAp = useWatch({
    control,
    name: "passport",
    defaultValue: "&",
  });

  const passportCo = useWatch({
    control,
    name: "passport_conyugue",
    defaultValue: "&",
  });

  const emailVerif = useWatch({
    control,
    name: "email",
    defaultValue: "&",
  });

  const isInvalidPassport = useMemo(() => {
    if (passportAp === "&") return false;

    return ValidatePassport(passportAp) ? false : true;
  }, [passportAp]);

  const isInvalidEmail = useMemo(() => {
    if (emailVerif === "&") return false;

    return validateEmail(emailVerif) ? false : true;
  }, [emailVerif]);

  const isInvalidPassportCo = useMemo(() => {
    if (passportCo === "&") return false;

    return ValidatePassport(passportCo) ? false : true;
  }, [passportCo]);

  useEffect(() => {
    if (!haveKids) {
      remove();
    }
  }, [haveKids, remove]);

  useEffect(() => {
    if (isSubmitSuccessful) onOpen();
  }, [isSubmitSuccessful]);

  useEffect(() => {
    if (closePage) {
      reset();
      window.close();
    }
  }, [closePage]);

  return (
    <div
      id="in_body"
      className="flex relative w-full h-fit bg-background justify-center overflow-x-hidden"
    >
      <div className="flex absolute w-screen h-full opacity-70 bg-gradient-to-r from-blue-200 via-sky-800 to-sky-200 "></div>
      <div
        id="Page1"
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
          id="form_body"
          className="flex relative w-full md:w-4/5 h-full text-sm md:text-xl text-secondary font-bold mb-unit-3xl"
        >
          <div className="flex absolute -z-30 w-full h-full bg-white border-2 border-primary/70 rounded-medium"></div>

          <div className="flex flex-col text-primary">
            <div className="mb-4">
              <h1 className="text-2xl p-4 text-justify md:text-4xl flex w-full h-auto justify-center my-5 md:my-10 ">
                LOTERIA DE VISAS - VISA FORM
              </h1>
              <Divider className="my-2 md:my-5 bg-primary" />
              <p className="m-unit-md text-justify px-3 md:px-8">
                {
                  "INDICACIONES: No puede quedar nada vacío, detallar dirección exacta – manzana, villa, solar, etc. Información incompleta puede descalificar su aplicación automáticamente – instrucción educativa no puede quedar vacio, indicar educación mas alta obtenida."
                }
              </p>
              <Divider className="my-2 md:my-5 bg-primary" />
            </div>
            <div className="mb-4 p-unit-md md:p-unit-xl ">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid grid-cols-1 gap-5  "
              >
                <h1 className="text-2xl md:text-4xl">Aplicante</h1>

                <div
                  id="nombres_completos"
                  className="grid grid-flow-row md:grid-cols-3 gap-3 border-2 border-primary/50 rounded-lg pb-4"
                >
                  <div
                    className={`md:col-span-3 border-b-2 border-primary/50 ${componentStyle}`}
                  >
                    <h1>Nombres completos</h1>
                  </div>

                  <div
                    className={`md:col-span-3 text-sm md:text-medium font-normal ${componentStyle}`}
                  >
                    Nota: Colocar nombres y apellidos como se muestran en su
                    documento de identidad.
                  </div>
                  <div className={componentStyle}>
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
                  <div className={componentStyle}>
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
                  <div className={componentStyle}>
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
                  className="grid grid-flow-row md:grid-cols-2 gap-3 border-2 border-primary/50 rounded-lg pb-4"
                >
                  <div
                    className={`md:col-span-2 border-b-2 border-primary/50 ${componentStyle}`}
                  >
                    <h1>Género</h1>
                  </div>
                  <div className={componentStyle}>
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
                      <Radio
                        value={"hombre"}
                        key="hombre"
                        className="mt-2 md:mr-4 "
                      >
                        <div
                          className={`flex flex-row flex-nowrap items-center text-sm md:text-medium ${
                            sexo === "hombre" && "text-primary"
                          }`}
                        >
                          <Man className="h-6 md:h-8 aspect-w-1" />
                          <span>Masculino</span>
                        </div>
                      </Radio>
                      <Radio
                        value={"mujer"}
                        key="mujer"
                        className="mt-2 md:mr-4 "
                      >
                        <div
                          className={`flex flex-row flex-nowrap items-center text-sm md:text-medium ${
                            sexo === "mujer" && "text-pink-400"
                          }`}
                        >
                          <Woman className="h-6 md:h-8 aspect-w-1" />
                          <span>Femenino</span>
                        </div>
                      </Radio>
                    </RadioGroup>
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
                  <div
                    className={`md:col-span-2 text-sm md:text-medium font-normal ${componentStyle}`}
                  >
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
                  <div className={componentStyle}>
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

                  <div className={componentStyle}>
                    <div className="text-sm md:text-medium mb-3">
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
                      isRequired
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
                      isRequired
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
                      isRequired
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
                      isRequired
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
                      isRequired
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
                    <div className="text-primary text-sm md:text-medium opacity-100 font-bold pb-2 after:content-['*'] after:text-danger after:ml-0.5">
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
                      isRequired
                      {...register("email")}
                      placeholder="you@example.com"
                      variant="underlined"
                      labelPlacement="outside"
                      isInvalid={isInvalidEmail}
                      color={isInvalidEmail ? "danger" : "success"}
                      errorMessage={
                        isInvalidEmail && "Please enter a valid email"
                      }
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
                      isRequired
                      {...register("passport", {
                        pattern: /^\d{10}$/,
                      })}
                      placeholder="xxxxxxxxxx"
                      variant="underlined"
                      isInvalid={isInvalidPassport}
                      color={isInvalidPassport ? "danger" : "success"}
                      errorMessage={
                        isInvalidPassport &&
                        "Please enter a valid passport number"
                      }
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
                      isRequired
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
                      isRequired
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

                  <div
                    className={`text-sm md:text-medium font-normal ${componentStyle}`}
                  >
                    <p>
                      Debe tener un mínimo de titulo de educación secundaria
                      culminado (escuela de vocacion o equivalente) ó demostrar
                      ser un trabajador con habilidades que requieren al menos 2
                      años de entrenamiento o experiencia laboral.
                    </p>
                  </div>
                  <div className={componentStyle}>
                    <Select
                      isRequired
                      labelPlacement="outside"
                      label="Nivel de educación más alto obtenido"
                      {...register("education")}
                      placeholder="Seleccione una opción"
                      variant="underlined"
                      className="max-w-xs"
                      classNames={{
                        label: labelsStyle,
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
                      <SelectItem
                        value={"universidad sin titulo"}
                        key="universidad_st"
                      >
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
                  <>
                    <h1 className="text-2xl md:text-4xl">Conyugue</h1>

                    <div
                      id="nombres_completos_conyugue"
                      className="grid grid-flow-row md:grid-cols-3 gap-3 border-2 border-primary/50 rounded-lg pb-4"
                    >
                      <div
                        className={`md:col-span-3 border-b-2 border-primary/50 ${componentStyle}`}
                      >
                        <h1>Datos del conyugue</h1>
                      </div>

                      <div
                        className={`md:col-span-3 text-sm md:text-medium font-normal ${componentStyle}`}
                      >
                        Nota: Colocar nombres y apellidos como se muestran en su
                        documento de identidad.
                      </div>
                      <div className={componentStyle}>
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
                      <div className={componentStyle}>
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
                      <div className={componentStyle}>
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

                      <div className={`${componentStyle} md:col-end-2`}>
                        <Input
                          type="text"
                          label="No. Pasaporte/ID"
                          isRequired
                          {...register("passport_conyugue", {
                            pattern: /^\d{10}$/,
                          })}
                          placeholder="xxxxxxxxxx"
                          variant="underlined"
                          labelPlacement="outside"
                          isInvalid={isInvalidPassportCo}
                          color={isInvalidPassportCo ? "danger" : "success"}
                          errorMessage={
                            isInvalidPassportCo &&
                            "Please enter a valid passport number"
                          }
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
                          isRequired
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
                          isRequired
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
                  </>
                )}

                {haveKids && (
                  <>
                    <h1 className="text-2xl md:text-4xl">Conyugue</h1>

                    <div
                      id="datos_hijos"
                      className="flex flex-col flex-nowrap gap-3 border-2 border-primary/50 rounded-lg pb-4"
                    >
                      <div
                        className={`border-b-2 border-primary/50 ${componentStyle}`}
                      >
                        <h1>Datos</h1>
                      </div>

                      <div
                        className={`text-sm md:text-medium font-normal ${componentStyle}`}
                      >
                        <p>
                          <span className="text-warning">Importante!</span> Debe
                          incluir a todos sus hijos biologicos, adoptados,
                          hijastros/as solteros menores a 21 años a partir del
                          dia del registro de esta aplicacion. Debe incluir
                          hijos que viven y que no viven con usted, ademas hijos
                          que aun despues de ser acreedores a la loteria no
                          deseen viajar a los Estados Unidos con usted.
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
                          <div key={field.id}>
                            <div
                              className={`grid grid-flow-row md:grid-cols-4 gap-5 ${componentStyle}`}
                            >
                              <div className="md:col-span-2">
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
                              <div className="md:col-span-2">
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

                              <div className="md:col-span-2">
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
                                <PersonDelete className="h-8 md:h-10 aspect-w-1" />
                              </button>
                            </div>
                            <Divider className="mb-4" />
                          </div>
                        );
                      })}

                      <div
                        className={`text-sm md:text-medium flex relative justify-center ${componentStyle}`}
                      >
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
                  </>
                )}

                <div
                  id="foto_visa"
                  className="flex flex-col items-center gap-3 border-2 border-primary/50 rounded-lg pb-4"
                >
                  <div
                    className={`border-b-2 border-primary/50 w-full ${componentStyle}`}
                  >
                    <h1>Foto visa y documento de identidad</h1>
                  </div>

                  <div
                    className={`gap-4 text-sm md:text-medium w-full text-center ${componentStyle}`}
                  >
                    <h1> Requisitos </h1>
                    <p className="font-normal">
                      Cargar fotografias en formato .jpg tamaño 5x5 cm fondo
                      blanco.{" "}
                    </p>
                  </div>
                  <div className="flex relative w-52 h-52 md:w-96 md:h-96">
                    <Image
                      src="./pictures/req_foto_visa.jpeg"
                      fill
                      alt={"requirements visa photo"}
                    />
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
                        isLoaded={createObjectURLs["aplicante"] != null}
                        className=" w-52 h-52 md:w-72 md:h-72 flex relative  mx-auto"
                      >
                        {createObjectURLs["aplicante"] && (
                          <Image
                            src={createObjectURLs["aplicante"]}
                            fill
                            alt={"visa photo"}
                          />
                        )}
                      </Skeleton>

                      <div className="w-full h-fit my-4">
                        <Input
                          type="file"
                          isRequired
                          {...register("foto_aplicante", {
                            onChange: (e) => uploadToClient(e, 0, "aplicante"),
                          })}
                          accept=".jpg, .jpeg, .png"
                          //placeholder="mm/dd/yyyy"
                          variant="underlined"
                          labelPlacement="outside"
                          classNames={{
                            label: labelsStyle,
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col md:ml-5">
                      <h1 className="mb-8">Foto Pasaporte / cédula</h1>

                      <Skeleton
                        isLoaded={createObjectURLs["aplicanteID"] != null}
                        className=" w-52 h-52 md:w-72 md:h-72 flex relative  mx-auto"
                      >
                        {createObjectURLs["aplicanteID"] && (
                          <Image
                            src={createObjectURLs["aplicanteID"]}
                            fill
                            alt={"visa photo ID"}
                          />
                        )}
                      </Skeleton>

                      <div className="w-full h-fit my-4">
                        <Input
                          type="file"
                          isRequired
                          {...register("foto_aplicante_id", {
                            onChange: (e) =>
                              uploadToClient(e, 0, "aplicanteID"),
                          })}
                          accept=".jpg, .jpeg, .png"
                          //placeholder="mm/dd/yyyy"
                          variant="underlined"
                          labelPlacement="outside"
                          classNames={{
                            label: labelsStyle,
                          }}
                        />
                      </div>
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
                          isLoaded={createObjectURLs["conyugue"] != null}
                          className="w-52 h-52 md:w-72 md:h-72 flex relative  mx-auto"
                        >
                          {createObjectURLs["conyugue"] && (
                            <Image
                              src={createObjectURLs["conyugue"]}
                              fill
                              alt={"visa photo"}
                            />
                          )}
                        </Skeleton>

                        <div className="w-full h-fit my-4">
                          <Input
                            type="file"
                            isRequired
                            {...register("foto_conyugue", {
                              onChange: (e) => uploadToClient(e, 0, "conyugue"),
                            })}
                            accept=".jpg, .jpeg, .png"
                            variant="underlined"
                            labelPlacement="outside"
                            classNames={{
                              label: labelsStyle,
                            }}
                          />
                        </div>
                      </div>

                      <div className="flex flex-col md:ml-5">
                        <h1 className="mb-8">Foto Pasaporte / cédula</h1>
                        <Skeleton
                          isLoaded={createObjectURLs["conyugueID"] != null}
                          className="w-52 h-52 md:w-72 md:h-72 flex relative  mx-auto"
                        >
                          {createObjectURLs["conyugueID"] && (
                            <Image
                              src={createObjectURLs["conyugueID"]}
                              fill
                              alt={"visa photo"}
                            />
                          )}
                        </Skeleton>

                        <div className="w-full h-fit my-4">
                          <Input
                            type="file"
                            isRequired
                            {...register("foto_conyugue_id", {
                              onChange: (e) =>
                                uploadToClient(e, 0, "conyugueID"),
                            })}
                            accept=".jpg, .jpeg, .png"
                            variant="underlined"
                            labelPlacement="outside"
                            classNames={{
                              label: labelsStyle,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {haveKids &&
                    fields.map((field, index) => {
                      return (
                        <div
                          key={field.id}
                          className={`grid grid-flow-row md:grid-cols-2 gap-3 text-center ${componentStyle}`}
                        >
                          <div className="md:col-span-2 text-medium md:text-xl my-4">
                            {`Carga #${index + 1}`}
                          </div>

                          <div className="flex flex-col md:mr-5">
                            <h1 className="mb-8">Foto tipo visa</h1>
                            <Skeleton
                              isLoaded={
                                createObjectURLs[`kid_${index}`] != null
                              }
                              className="w-52 h-52 md:w-72 md:h-72 flex relative  mx-auto"
                            >
                              {createObjectURLs[`kid_${index}`] && (
                                <Image
                                  src={createObjectURLs[`kid_${index}`]!}
                                  fill
                                  alt={"visa photo"}
                                />
                              )}
                            </Skeleton>

                            <div className="w-full h-fit my-4">
                              <Input
                                type="file"
                                isRequired
                                {...register(
                                  `children.${index}.foto_kid` as const,
                                  {
                                    onChange: (e) =>
                                      uploadToClient(e, index, "kid"),
                                  }
                                )}
                                accept=".jpg, .jpeg, .png"
                                variant="underlined"
                                labelPlacement="outside"
                                classNames={{
                                  label: labelsStyle,
                                }}
                              />
                            </div>
                          </div>

                          <div className="flex flex-col md:ml-5">
                            <h1 className="mb-8">Foto Pasaporte / cédula</h1>
                            <Skeleton
                              isLoaded={
                                createObjectURLs[`kidID_${index}`] != null
                              }
                              className="w-52 h-52 md:w-72 md:h-72 flex relative  mx-auto"
                            >
                              {createObjectURLs[`kidID_${index}`] && (
                                <Image
                                  src={createObjectURLs[`kidID_${index}`]!}
                                  fill
                                  alt={"visa photo"}
                                />
                              )}
                            </Skeleton>

                            <div className="w-full h-fit my-4">
                              <Input
                                type="file"
                                isRequired
                                {...register(
                                  `children.${index}.foto_kid_id` as const,
                                  {
                                    onChange: (e) =>
                                      uploadToClient(e, index, "kidID"),
                                  }
                                )}
                                accept=".jpg, .jpeg, .png"
                                variant="underlined"
                                labelPlacement="outside"
                                classNames={{
                                  label: labelsStyle,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>

                <div className="w-fit h-fit flex relative justify-self-center p-6 md:p-0 my-4 md:my-10 text-sm md:text-medium">
                  <Checkbox
                    isSelected={acceptPolitics}
                    onValueChange={setAcceptPolitics}
                  >
                    <Link
                      onClick={() => {
                        setTypeWarning("politics");
                        onOpen();
                      }}
                    >
                      POLITICA DE CONFIDENCIALIDAD
                    </Link>
                  </Checkbox>
                </div>

                <div className="w-fit h-fit flex relative justify-self-center">
                  <Button
                    color="primary"
                    type="submit"
                    size="md"
                    isLoading={isSubmitting}
                    isDisabled={!acceptPolitics}
                    className="text-sm md:text-medium font-bold"
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
                <ModalHeader>
                  {isSubmitSuccessful ? (
                    <p className="text-success">
                      Successful: Formulario enviado correctamente!.
                    </p>
                  ) : typeWarning == "warning" ? (
                    <p className="text-warning">
                      Warning: Image out of size limits
                    </p>
                  ) : (
                    <p className="text-primary">POLITICA DE CONFIDENCIALIDAD</p>
                  )}
                </ModalHeader>
                <ModalBody className="text-justify text-sm md:text-medium ">
                  {isSubmitSuccessful ? (
                    <p>
                      Nos contactaremos mediante el número telefónico del
                      aplicante.
                    </p>
                  ) : typeWarning == "warning" ? (
                    <p>
                      La imagen subida tiene un tamaño mayor a 1mb. Se
                      recomienda verificar el tamaño del archivo. Si continua
                      teniendo problemas subiendo las fotos, contactarse por
                      interno.
                    </p>
                  ) : (
                    <p>
                      La informacion ingresada es requerida segun la sección 222
                      del acto de imigración nacional de los Estados Unidos INA
                      sección 222(f). Sus datos seran confidenciales y seran
                      utilizados unica y exclusivamente para la formulacion,
                      administracion o implementacion de la imigracion,
                      nacionalidad y otras leyes de los Estados Unidos.{" "}
                      <Spacer y={4} /> Sus datos NO seran compartidos con
                      ninguna otra empresa, corporacion, fundacion o tercera
                      persona.
                    </p>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="primary"
                    variant="solid"
                    onPress={() =>
                      isSubmitSuccessful
                        ? (onClose(), setClosePage(true))
                        : (setTypeWarning("politics"), onClose())
                    }
                    className="text-sm md:text-medium font-bold"
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
