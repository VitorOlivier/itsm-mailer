const oracledb = require('oracledb');
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

const mypw = "KSM#ND5J"  

async function run() {
  console.log('inicio')
  try {
    oracledb.initOracleClient({libDir: 'C:\\Projetos\\instantclient_19_11'});
  } catch (err) {
    console.error('Whoops!');
    console.error(err);
    process.exit(1);
  }
  console.log('antes getConnection')
  let connection;  
  try {
    connection = await oracledb.getConnection( {
      user          : "DANIRG_B2CM",
      password      : mypw,
      connectString : "slcsddp04.marte.gbes:1531/PDEP1"
    });
    console.log('antes connection.execute')
    const result = await connection.execute(
      `SELECT sysdate col1
       FROM dual
       WHERE 1 = :id`,
      [1],  // bind value for :id
    );
    console.log('depois connection.execute')
    console.log(result.rows);

  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

run();