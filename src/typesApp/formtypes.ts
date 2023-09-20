
enum EstadoCivil {
  soltero = "soltero",
  casado = "casado",
  separado = "separado",
  viudo = "viudo",
  divorciado = "divorciado",
}

enum NivelEducacion {
  primaria = "primaria",
  secundaria = "secundaria",
  universidad = "universidad",
  universidad_st = "universidad_st",
  maestria = "maestria",
  doctorado = "doctorado",
}

enum Sexo {
  hombre = "hombre",
  mujer = "mujer",
}



export interface IFormInput {
  first_name: string;
  second_name: string;
  apellidos: string;
  sexo: Sexo;
  fecha_nacimiento: Date;
  ciudad_nacimiento: string;
  pais_nacimiento: string;
  pais_residencia: string;
  estado_civil: EstadoCivil;
  phone: string;
  email: string;
  direccion: string;
  passport: string;
  passport_emision: Date;
  passport_expiration: Date;
  education: NivelEducacion;
  foto_aplicante: FileList; 
  
  
  first_name_conyugue: string;
  second_name_conyugue: string;
  apellidos_conyugue: string;
  foto_conyugue: FileList; 
  passport_conyugue: string;
  passport_emision_conyugue: Date;
  passport_expiration_conyugue: Date;
  
  children: Kid[];

}

export interface Kid{
  first_name: string,
  second_name: string,
  apellidos: string,
  edad: number, 
  foto_kid?: FileList, 
}

export interface FormDataAplicante {
  action: string;
  registration_date: string;
  names: string;
  surnames: string;
  sexo: string;
  birth_date: string;
  birth_city: string;
  birth_country: string;
  residence_country: string;
  civil_status: string;
  children: string;
  phone: string;
  email: string;
  address: string;
  passport: string;
  passport_emision: string;
  passport_expiration: string;
  education: string;
  foto_url: string;
}

export interface formDataFamiliar {
  action: string;
  registration_date: string;
  names: string;
  surnames: string;  
  edad?: string,
  passport?: string;
  passport_emision?: string;
  passport_expiration?: string;
  foto_url: string;
  id_aplicante: string,
}

