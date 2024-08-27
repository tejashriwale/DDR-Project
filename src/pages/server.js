const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const app = express();
const port = 5000; 

app.use(express.json());
app.use(cors());

const config = {
    user: 'sa',
    password: '123456',
    server: '192.168.1.121\\SQLEXPRESS',
    database: 'DDR',
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

async function connectToDatabase() {
    try {
        const pool = await sql.connect(config);
        return pool;
    } catch (error) {
        console.error('Database connection failed:', error);
        throw new Error('Database connection failed');
    }
}

app.post('/api/organization', async (req, res) => {
  try {
    const pool = await connectToDatabase();

    const result1 = await pool.request()
        .execute('mcfGUID');

    const generatedValue = result1.recordset[0].GUID;

    const { ZoneID, DIST, TALUKA, WATahasil, VILLAGE, PAXTYPE, ORGCODE, ORGID, PAXTM, PAXTE, PAXADD, PAXPIN, ORDDT, PAXLOC, ASID, IsDeleted } = req.body;

    const result = await sql.query`
    INSERT INTO tblOrganization ( ORGAID,ZoneID, DIST, TALUKA,WATahasil, VILLAGE, PAXTYPE, ORGCODE, ORGID, PAXTM, PAXTE, PAXADD, PAXPIN, ORDDT,PAXLOC,ASID,IsDeleted )
    VALUES (${generatedValue},${ZoneID}, ${DIST}, ${TALUKA},${WATahasil}, ${VILLAGE}, ${PAXTYPE}, ${ORGCODE}, ${ORGID}, ${PAXTM}, ${PAXTE}, ${PAXADD}, ${PAXPIN}, ${ORDDT},${PAXLOC},${ASID},${IsDeleted})
  `;
     res.status(201).send({ message: 'Data saved successfully', result });
    }catch (error) {
            console.error('Error occurred:', error);
            res.status(500).send({ message: 'Error occurred', error });
        }
    });

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
