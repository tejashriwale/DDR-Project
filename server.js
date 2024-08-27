const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const app = express();
const port = 5000; 

app.use(express.json());
app.use(cors());

const config = {
    user: 'tw',
    password: '123456',
    server: 'DESKTOP-UALB1I1\   \SQLEXPRESS',
    database: 'DDR',
    options: {
      instanceName: 'SQLEXPRESS',
      encrypt: false,
      trustServerCertificate: true,
      connectionTimeout: 60000, // increase timeout to 30 seconds
      requestTimeout: 60000, // optional, increase request timeout
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

    app.post('/login', async (req, res) => {
        const { email, password } = req.body;
        
        try {
            const pool = await connectToDatabase();
            const result = await pool.request()
                .input('email', sql.VarChar, email)
                .input('password', sql.VarChar, password)
                .query('SELECT * FROM ST_UserProfile2 WHERE UserEMailAddress = @email AND UserPassword = @password');
            
            if (result.recordset.length > 0) {
                res.status(200).json({ success: true, message: 'Login successful' });
            } else {
                res.status(401).json({ success: false, message: 'Invalid email or password' });
            }
        } catch (err) {
            res.status(500).json({ success: false, message: 'Server error' });
        }
    });

    app.get('/api/organizations', async (req, res) => {
        try {
            const pool = await connectToDatabase();
            const result = await pool.request().query('SELECT * FROM tblOrganization WHERE IsDeleted = 0 ORDER BY ORGAID DESC');
    
            res.status(200).json(result.recordset);
        } catch (error) {
            console.error('Error fetching data:', error);
            res.status(500).send({ message: 'Error fetching data', error });
        }
    });

    app.post('/api/implications', async (req, res) => {
        try {
            const pool = await connectToDatabase();
    
            const result1 = await pool.request()
                .execute('mcfGUID');
    
            const generatedValue1 = result1.recordset[0].GUID;
    
            const { ImplicationAutoID, implicationTitle, implicationValue, implicationOrder, implicationGroup, isSystemDefined, IsIgnored } = req.body;
    
            await pool.request()
                .input('ImplicationAutoID', sql.NVarChar, generatedValue1)
                .input('ImplicationTitle', sql.NVarChar, implicationTitle)
                .input('ImplicationValue', sql.NVarChar, implicationValue)
                .input('ImplicationOrder', sql.Int, implicationOrder)
                .input('ImplicationGroup', sql.NVarChar, implicationGroup)
                .input('IsSystemDefined', sql.Bit, isSystemDefined)
                .input('IsIgnored', sql.Bit, IsIgnored)
                .query(`
                    INSERT INTO ST_Implication (ImplicationAutoID, ImplicationTitle, ImplicationValue, ImplicationOrder, ImplicationGroup, IsSystemDefined, IsIgnored)
                    VALUES (@ImplicationAutoID, @implicationTitle, @implicationValue, @implicationOrder, @implicationGroup, @isSystemDefined, @isIgnored)
                `);
    
            res.status(200).send('Implication added successfully');
        } catch (err) {
            console.error('Error occurred:', err);
            res.status(500).send(err.message);
        }
    });

    app.get('/api/implications/groups', async (req, res) => {
        try {
            const pool = await connectToDatabase();
            const result = await pool.request().query('SELECT DISTINCT ImplicationGroup FROM ST_Implication WHERE IsDeleted=0');
            res.status(200).json(result.recordset.map(row => row.ImplicationGroup));
        } catch (error) {
            console.error('Error fetching groups:', error);
            res.status(500).send({ message: 'Error fetching groups', error });
        }
    });

    app.get('/api/implications/paxtype', async (req, res) => {
        try {
            const pool = await connectToDatabase();
            const result = await pool.request().query(`
                SELECT ImplicationTitle, ImplicationValue 
                FROM ST_Implication 
                WHERE ImplicationGroup = 'PAXTYPE' AND IsDeleted = 0
            `);
            console.log('PAXTYPE values:', result.recordset);
            res.status(200).json(result.recordset.map(row => ({
                ImplicationTitle: row.ImplicationTitle,
                ImplicationValue: row.ImplicationValue
            })));
        } catch (error) {
            console.error('Error fetching PAXTYPE values:', error);
            res.status(500).send({ message: 'Error fetching PAXTYPE values', error });
        }
    });

    app.patch('/api/organizations/:id', async (req, res) => {
        const { id } = req.params;
        const { IsDeleted } = req.body;
        
        if (!id || IsDeleted === undefined) {
          return res.status(400).send({ message: 'Invalid request data' });
        }
      
        try {
          const pool = await connectToDatabase();
          const result = await pool.request()
            .input('id', sql.NVarChar, id)
            .input('IsDeleted', sql.Bit, IsDeleted)
            .query(`
              UPDATE tblOrganization 
              SET IsDeleted = @IsDeleted 
              WHERE ORGAID = @id
            `);
      
          if (result.rowsAffected[0] === 0) {
            return res.status(404).send({ message: 'Organization not found' });
          }
      
          res.status(200).send({ message: 'Organization updated successfully' });
        } catch (error) {
          console.error('Error updating organization:', error);
          res.status(500).send({ message: 'Error updating organization', error });
        }
      });

    app.get('/api/implications', async (req, res) => {
        try {
            const result = await sql.query('SELECT * FROM ST_Implication WHERE IsDeleted = 0');
            res.json(result.recordset);
        } catch (err) {
            res.status(500).send('Error fetching implications: ' + err.message);
        }
    });
    
    app.get('/api/organizationupdate/:id', async (req, res) => {
        const { id } = req.params;
        const {
            ORGAID,ZoneID, DIST, TALUKA, WATahasil, VILLAGE, PAXTYPE, ORGCODE, ORGID, PAXTM, PAXTE, PAXADD, PAXPIN, ORDDT, PAXLOC, ASID, IsDeleted
        } = req.body;

        if (!id) {
            return res.status(400).send({ message: 'Invalid ID' });
        }

        try {
            const pool = await connectToDatabase();
            const result = await pool.request()
            .input('ZoneID', sql.NVarChar, ZoneID)
            .input('DIST', sql.NVarChar, DIST)
            .input('TALUKA', sql.NVarChar, TALUKA)
            .input('WATahasil', sql.NVarChar, WATahasil)
            .input('VILLAGE', sql.NVarChar, VILLAGE)
            .input('PAXTYPE', sql.NVarChar, PAXTYPE)
            .input('ORGCODE', sql.NVarChar, ORGCODE)
            .input('ORGID', sql.NVarChar, ORGID)
            .input('PAXTM', sql.NVarChar, PAXTM)
            .input('PAXTE', sql.NVarChar, PAXTE)
            .input('PAXADD', sql.NVarChar, PAXADD)
            .input('PAXPIN', sql.NVarChar, PAXPIN)
            .input('ORDDT', sql.Date, ORDDT)
            .input('PAXLOC', sql.NVarChar, PAXLOC)
            .input('ASID', sql.NVarChar, ASID)
            .input('IsDeleted', sql.Bit, IsDeleted)
            .input('id', sql.NVarChar, id)
            .query(`
                UPDATE tblOrganization 
                SET ZoneID = @ZoneID,
                    DIST = @DIST,
                    TALUKA = @TALUKA,
                    WATahasil = @WATahasil,
                    VILLAGE = @VILLAGE,
                    PAXTYPE = @PAXTYPE,
                    ORGCODE = @ORGCODE,
                    ORGID = @ORGID,
                    PAXTM = @PAXTM,
                    PAXTE = @PAXTE,
                    PAXADD = @PAXADD,
                    PAXPIN = @PAXPIN,
                    ORDDT = @ORDDT,
                    PAXLOC = @PAXLOC,
                    ASID = @ASID,
                    IsDeleted = @IsDeleted
                WHERE ORGAID = @id
            `);
            if (result.rowsAffected[0] === 0) {
                return res.status(404).send({ message: 'Organization not found' });
            }

            res.status(200).send({ message: 'Organization updated successfully' });
        } catch (error) {
            console.error('Error updating organization:', error);
            res.status(500).send({ message: 'Error updating organization', error: error.message });
        }
    }); 

    app.post('/api/auditors', async (req, res) => {
        try {
            const pool = await connectToDatabase();
    
            const result1 = await pool.request()
                .execute('mcfGUID');
    
            const generatedValue = result1.recordset[0].GUID;
    
            const { auditorTM, auditorTE, contact, district, designation } = req.body;
    
            await pool.request()
                .input('ADTAID', sql.NVarChar, generatedValue)
                .input('AUDITORTM', sql.NVarChar, auditorTM)
                .input('AUDITORTE', sql.NVarChar, auditorTE)
                .input('CONTACT', sql.NVarChar, contact)
                .input('DISTRICT', sql.NVarChar, district)
                .input('DESIGNATION', sql.NVarChar, designation)
                .input('ASID', sql.NVarChar, generatedValue)
                .query(`
                    INSERT INTO tblAuditor (ADTAID, AUDITORTM, AUDITORTE, CONTACT, DISTRICT, DESIGNATION, ASID)
                    VALUES (@ADTAID, @AUDITORTM, @AUDITORTE, @CONTACT, @DISTRICT, @DESIGNATION, @ASID)
                `);
    
            res.status(201).send({ message: 'Auditor data saved successfully' });
        } catch (error) {
            console.error('Error occurred:', error);
            res.status(500).send({ message: 'Error occurred', error });
        }
    });

    app.get('/api/auditors1', async (req, res) => {
        try {
            const pool = await connectToDatabase();
            const result = await pool.request().query('SELECT * FROM tblAuditor WHERE IsDeleted = 0');
            res.json(result.recordset);
        } catch (err) {
            console.error('Error fetching auditors:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });
    app.patch('/api/auditors/:id', async (req, res) => {
        const { id } = req.params;
        const { IsDeleted } = req.body;
    
        if (!id || IsDeleted === undefined) {
            return res.status(400).send({ message: 'Invalid request data' });
        }
    
        try {
            const pool = await connectToDatabase();
            const result = await pool.request()
                .input('id', sql.NVarChar, id)
                .input('IsDeleted', sql.Bit, IsDeleted)
                .query(`
                    UPDATE tblAuditor 
                    SET IsDeleted = @IsDeleted 
                    WHERE ADTAID = @id
                `);
    
            if (result.rowsAffected[0] === 0) {
                return res.status(404).send({ message: 'Auditor not found' });
            }
    
            res.status(200).send({ message: 'Auditor updated successfully' });
        } catch (error) {
            console.error('Error updating auditor:', error);
            res.status(500).send({ message: 'Error updating auditor', error });
        }
    });

    app.get('/api/implications/:id', async (req, res) => {
        const { id } = req.params;
        if (!id) {
            return res.status(400).send({ message: 'Invalid ID' });
        }
    
        try {
            const pool = await connectToDatabase();
            const result = await pool.request()
                .input('id', sql.NVarChar, id)
                .query(`
                    UPDATE ST_Implication 
                    SET IsDeleted = 1
                    WHERE ImplicationAutoID = @id
                `);
            
            if (result.recordset.length === 0) {
                return res.status(404).send({ message: 'Implication not found' });
            }
    
            res.status(200).json(result.recordset[0]);
        } catch (error) {
            console.error('Error fetching implication:', error);
            res.status(500).send({ message: 'Error fetching implication', error });
        }
    });
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
