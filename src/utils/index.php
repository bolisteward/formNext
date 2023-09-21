<?php
// Configuración de la conexión a la base de datos
$servername = "localhost"; // Cambia esto al nombre de tu servidor MySQL
$username = "visagbal_devsup1"; // Cambia esto a tu nombre de usuario de MySQL
$password = "ByBJSzPuh_0W";     // Cambia esto a tu contraseña de MySQL
$database = "visagbal_visa_database"; // Cambia esto al nombre de tu base de datos

try {
    $pdo = new PDO("mysql:host=$host;dbname=$database;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Error de conexión: " . $e->getMessage());
}


// Función para insertar un miembro en una familia
function insertarAplicante($registration_date, $names, $surnames, $sexo,  $birth_date, $birth_city, $birth_country, $residence_country, $civil_status, $children, $phone, $email, $address, $passport, $passport_emision, $passport_expiration, $education, $foto_url) {

    global $pdo;

    try {

        $id_aplicante = verificarExistencia("Aplicante", $names, $surnames);
        
        if ($id_aplicante != 0 ) {

            $stmt = $pdo->prepare("UPDATE Aplicante SET registration_date = ?, names = ?, surnames = ?, sexo = ?, birth_date = ?, birth_city = ?, birth_country = ?, residence_country = ?, civil_status = ?, children = ?, phone = ?, email = ?, address = ?, passport = ?, passport_emision = ?, passport_expiration = ?, education = ?, foto_url = ? WHERE id = ?");

            $stmt->execute([$registration_date, $names, $surnames, $sexo, $birth_date, $birth_city, $birth_country, $residence_country, $civil_status, $children, $phone, $email, $address, $passport, $passport_emision, $passport_expiration, $education, $foto_url, $id_aplicante]);

            return $id_aplicante;
        }
        else {
            $stmt = $pdo->prepare("INSERT INTO Aplicante (registration_date, names, surnames, sexo, birth_date, birth_city, birth_country, residence_country, civil_status, children, phone, email, address, passport, passport_emision, passport_expiration, education, foto_url) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
            
            $stmt->execute([$registration_date, $names, $surnames, $sexo, $birth_date, $birth_city, $birth_country, $residence_country, $civil_status, $children, $phone, $email, $address, $passport, $passport_emision, $passport_expiration, $education, $foto_url]);
            
            $idInsertado = $pdo->lastInsertId();
            return $idInsertado;
        }
        
    } catch (PDOException $e) {
        return 0;
    }
}

// Función para insertar una familia
function insertarConyugue($registration_date, $names, $surnames, $passport, $passport_emision, $passport_expiration, $foto_url, $id_aplicante ) {
    
    global $pdo;

    try {

        $id_familiar = verificarExistencia("Familiar", $names, $surnames);
        
        if ($id_familiar != 0 ) {

            $stmt = $pdo->prepare("UPDATE Familiar SET registration_date = ?, names = ?, surnames = ?, passport = ?, passport_emision = ?, passport_expiration = ?, foto_url = ? WHERE id = ?");

            $stmt->execute([$registration_date, $names, $surnames, $passport, $passport_emision, $passport_expiration, $foto_url, $id_familiar]);

            return $id_familiar;

        }
        else {
            $stmt = $pdo->prepare("INSERT INTO Familiar (registration_date, names, surnames, passport, passport_emision, passport_expiration, foto_url, id_aplicante) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            
            $stmt->execute([$registration_date, $names, $surnames, $passport, $passport_emision, $passport_expiration, $foto_url, $id_aplicante]);

            $idInsertado = $pdo->lastInsertId();
            return $idInsertado;
        }
    } catch (PDOException $e) {
        return 0;
    }
}

function insertarKid($registration_date, $names, $surnames, $edad, $foto_url, $id_aplicante ) {
    
    global $pdo;

    try {
        $id_familiar = verificarExistencia("Familiar", $names, $surnames);
        
        if ($id_familiar != 0 ) {

            $stmt = $pdo->prepare("UPDATE Familiar SET registration_date = ?, names = ?, surnames = ?, edad = ?, foto_url = ? WHERE id = ?");

            $stmt->execute([$registration_date, $names, $surnames, $edad, $foto_url, $id_familiar]);

            return $id_familiar;
        }
        else {
            $stmt = $pdo->prepare("INSERT INTO Familiar (registration_date, names, surnames, edad, foto_url, id_aplicante) VALUES (?, ?, ?, ?, ?, ?)");
            
            $stmt->execute([$registration_date, $names, $surnames, $edad, $foto_url, $id_aplicante]);

            $idInsertado = $pdo->lastInsertId();
            return $idInsertado;
        }
        
    } catch (PDOException $e) {
        return 0;
    }
}

// Función para verificar la existencia de nombres y apellidos en una tabla
function verificarExistencia($tabla, $nombres, $surnames) {
    global $pdo;

    $stmt = $pdo->prepare("SELECT id FROM $tabla WHERE names = ? AND surnames = ?");
    $stmt->execute([$names, $surnames]);
    $row = $stmt->fetch();

    return $row ? $row["id"] : 0;
}


// Manejo de las solicitudes POST
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $data = json_decode(file_get_contents("php://input"), true);

    if ($data["action"] === "aplicante") {
        $registration_date = $data["registration_date"];
        $names = $data["names"];
        $surnames = $data["surnames"];
        $sexo = $data["sexo"];
        $birth_date = $data["birth_date"];
        $birth_city = $data["birth_city"];
        $birth_country = $data["birth_country"];
        $residence_country = $data["residence_country"];
        $civil_status = $data["civil_status"];
        $children = $data["children"];
        $phone = $data["phone"];
        $email = $data["email"];
        $address = $data["address"];
        $passport = $data["passport"];
        $passport_emision = $data["passport_emision"];
        $passport_expiration = $data["passport_expiration"];
        $education = $data["education"];
        $foto_url = $data["foto_url"];

        
        $result = insertarAplicante($registration_date, $names, $surnames, $sexo, $birth_date, $birth_city, $birth_country, $residence_country, $civil_status, $children, $phone, $email, $address, $passport, $passport_emision, $passport_expiration, $education, $foto_url);
        
        if ($result != 0) {
            $response = ["mensaje" => "Aplicante agregado.","id" => $result];

        } else {
            $response = ["mensaje" => "Error al agregar el aplicante."];
        }


    } elseif ($data["action"] === "conyugue") {

        $registration_date = $data["registration_date"];
        $names = $data["names"];
        $surnames = $data["surnames"];
        $passport = $data["passport"];
        $passport_emision = $data["passport_emision"];
        $passport_expiration = $data["passport_expiration"];
        $foto_url = $data["foto_url"];
        $id_aplicante = $data["id_aplicante"];
        
        $result = insertarConyugue($registration_date, $names, $surnames, $passport, $passport_emision, $passport_expiration, $foto_url, $id_aplicante);
        
        if ($result != 0) {
            $response = ["mensaje" => "Familiar agregado exitosamente.", "id" => $result];
        } else {
            $response = ["mensaje" => "Error al agregar familiar."];
        }

    } elseif ($data["action"] === "kid") {

        $registration_date = $data["registration_date"];
        $names = $data["names"];
        $surnames = $data["surnames"];
        $edad = $data["edad"];
        $foto_url = $data["foto_url"];
        $id_aplicante = $data["id_aplicante"];
        
        $result = insertarKid($registration_date, $names, $surnames, $edad, $foto_url, $id_aplicante);
        
        if ($result != 0) {
            $response = ["mensaje" => "Familiar agregado exitosamente.", "id" => $result];
        } else {
            $response = ["mensaje" => "Error al agregar familiar."];
        }

    } else {
        $response = ["mensaje" => "Incorrect action."];
    }
    header("Content-Type: application/json");
    echo json_encode($response);
}
?>