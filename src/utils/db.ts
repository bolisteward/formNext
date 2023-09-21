import mysql from 'mysql2/promise';

const dbConfig = {
  host: 'localhost',
  user: 'roseyeqe_admin',
  password: 'C46%ZaTyma9e',
  database: 'roseyeqe_database',
};

export async function connectToDatabase() {
  return await mysql.createConnection(dbConfig);
}

export default connectToDatabase;