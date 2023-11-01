// server.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000; // Replace with your desired port number

app.use(cors());
app.use(bodyParser.json());

// MySQL Database Configuration
const db = mysql.createConnection({
  host: 'localhost', // Replace with your MySQL host
  user: 'root',      // Replace with your MySQL user
  password: 'Silvi@2002',  // Replace with your MySQL password
  database: 'Niramay', // Replace with your MySQL database name
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed: ', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

// Example API endpoint to fetch data from MySQL
app.get('/api/data', (req, res) => {
  const sql = 'SELECT * FROM users'; // Replace with your table name
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error querying the database: ', err);
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json(result);
    }
  });
});
// Add this code to your server.js file

// User registration endpoint
app.post('/api/register', (req, res) => {
  const { name, email, password, phoneNumber, post } = req.body;

  // Perform data validation here, e.g., check if required fields are provided.

  // Insert user data into the users table
  const sql = 'INSERT INTO users (name, email, password, phoneNo, role) VALUES (?, ?, ?, ?, ?)';
  const values = [name, email, password, phoneNumber, post];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error inserting user data into the database: ', err);
      res.status(500).json({ error: 'Database error' });
    } else {
      res.status(201).json({ message: 'User registered successfully' });
    }
  });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  console.log("here");
  // Query the database to check if the email and password match a user record
  const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
  const values = [email, password];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error querying the database: ', err);
      res.status(500).json({ error: 'Database error' });
    } else {
      if (result.length > 0) {
        // User exists and credentials are correct
        res.status(200).json({ message: 'Login successful', user: result[0] });
      } else {
        // User not found or credentials are incorrect
        res.status(401).json({ error: 'Invalid credentials' });

      }
    }
  });
});


app.post('/submitForm', (req, res) => {
  const formData = req.body;
  formData.prevHistory = formData.prevHistory.join(', ');
  // Insert form data into the MySQL table
  db.query('INSERT INTO Customers SET ?', formData, (err, result) => {
    if (err) {
      throw err;
    }
    console.log('Form data inserted');
    res.send('Form data inserted');
  });
});

app.post('/checkData', (req, res) => {
  const { anganwadiNo, childsName } = req.body;
  console.log('anganwadiNo: ', anganwadiNo);
  console.log('childName: ', childsName);
  // Query the database to check if the data exists
  const sql = 'SELECT * FROM Customers WHERE anganwadiNo = ? AND childName = ?';
  const values = [anganwadiNo, childsName];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error querying the database: ', err);
      res.status(500).json({ error: 'Database error' });
    } else {
      console.log(result);
      if (result.length > 0) {
        // Data exists in the database
        res.status(200).json({ message: 'Data exists in the database' });
      } else {
        // Data does not exist in the database
        res.status(404).json({ message: "Data doesn't exist in the database" });
      }
    }
  });
});

app.post('/checkDataInGeneralHistory', (req, res) => {
  const { anganwadiNo, childsName } = req.body;
  console.log('anganwadiNo: ', anganwadiNo);
  console.log('childName: ', childsName);
  // Query the database to check if the data exists
  const sql = 'SELECT * FROM GeneralHistory WHERE anganwadiNo = ? AND childName = ?';
  const values = [anganwadiNo, childsName];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error querying the database: ', err);
      res.status(500).json({ error: 'Database error' });
    } else {
      if (result.length > 0) {
        // Data exists in the database
        res.status(200).json({ message: 'Data exists in the database' });
      } else {
        // Data does not exist in the database
        res.status(404).json({ message: "Data doesn't exist in the database" });
      }
    }
  });
});

app.post('/submit-sibling-data', (req, res) => {
  const { anganwadiNo, childName, siblings } = req.body;

  // Assuming you have a 'Siblings' table in your database
  // Use Promise.all to insert all siblings asynchronously
  const promises = siblings.map((sibling) => {
    const { name, age, malnourished } = sibling;

    return new Promise((resolve, reject) => {
      const sql = `
          INSERT INTO Siblings (anganwadiNo, childName, name, age, malnourished)
          VALUES (?, ?, ?, ?, ?)
        `;

      db.query(sql, [anganwadiNo, childName, name, age, malnourished], (err, results) => {
        if (err) {
          console.error('Error inserting sibling data:', err);
          reject(err);
        } else {
          console.log('Sibling data inserted successfully');
          resolve(results);
        }
      });
    });
  });

  // Wait for all insertions to complete
  Promise.all(promises)
    .then(() => {
      res.json({ message: 'All sibling data inserted successfully' });
    })
    .catch((error) => {
      res.status(500).json({ error: 'Internal server error' });
    });
});

app.post('/getFormData', (req, res) => {
  const { anganwadiNo, childsName } = req.body;
  //console.log(anganwadiNo,childsName)
  // Query the database to fetch the data
  const sql = 'SELECT * FROM Customers WHERE anganwadiNo = ? AND childName = ?';
  const values = [anganwadiNo, childsName];

  db.query(sql, values, (err, result) => {
    console.log(result);
    if (err) {
      console.error('Error querying the database: ', err);
      res.status(500).json({ error: 'Database error' });
    } else {
      if (result.length > 0) {
        // Data exists in the database
        res.status(200).json(result[0]); // Send the first row of data as JSON response
      } else {
        // Data does not exist in the database
        res.status(404).json({ message: "Data doesn't exist in the database" });
      }
    }
  });
});

app.post('/getSiblingData', async (req, res) => {
  const { anganwadiNo, childsName } = req.body;
  try {
    // Assuming you have a "siblings" table in your database
    //console.log(anganwadiNo, childsName);
    const [siblingData] = await db.promise().query(
      'SELECT * FROM siblings WHERE anganwadiNo = ? AND childName = ?',
      [anganwadiNo, childsName]
    );


    if (siblingData.length >= 0) {
      //console.log('Sibling Data:', siblingData);
      res.status(200).json(siblingData);
    } else {
      res.status(404).json({ message: 'Sibling data not found' });
    }
  } catch (error) {
    console.error('Error fetching sibling data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/generalHistory', (req, res) => {
  const generalHistoryData = req.body;

  // Perform the database insert operation
  db.query('INSERT INTO GeneralHistory SET ?', generalHistoryData, (err, result) => {
    if (err) {
      console.error('Error inserting data into GeneralHistory: ', err);
      res.status(500).json({ error: 'Error inserting data' });
    } else {
      console.log('Data inserted into GeneralHistory');
      res.status(200).json({ message: 'Data inserted successfully' });
    }
  });
});

app.post('/visits', (req, res) => {
  try {
    const { anganwadiNo, childName, visitDate, noOfSupplements, haemoglobin, muac, weight, height, difference, grade, observations } = req.body;
    console.log('Received Data:', req.body);
    // Insert data into the 'Visits' table
    const sql = 'INSERT INTO Visits (anganwadiNo, childName, visitDate, noOfSupplements, haemoglobin, muac, weight, height, difference, grade, observations) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [anganwadiNo, childName, visitDate, noOfSupplements, haemoglobin, muac, weight, height, difference, grade, observations], (err, result) => {
      if (err) {
        console.error('Database error: ' + err.message);
        res.status(500).json({ error: 'Error inserting data into the database' });
      } else {
        console.log('Data inserted successfully');
        res.status(200).json({ message: 'Data inserted successfully' });
      }
    });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route for fetching GeneralHistory data
app.post('/getGeneralHistory', (req, res) => {
  const { anganwadiNo, childsName } = req.body;

  const sql = 'SELECT * FROM GeneralHistory WHERE anganwadiNo = ? AND childName = ?';
  const values = [anganwadiNo, childsName];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error querying GeneralHistory:', err);
      res.status(500).json({ error: 'Database error' });
    } else {
      if (result.length > 0) {
        res.status(200).json(result);
      } else {
        res.status(404).json({ message: "Data doesn't exist in the GeneralHistory table" });
      }
    }
  });
});

// Route for fetching Visits data
app.post('/getVisits', (req, res) => {
  const { anganwadiNo, childsName } = req.body;

  const sql = 'SELECT * FROM Visits WHERE anganwadiNo = ? AND childName = ?';
  const values = [anganwadiNo, childsName];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error querying Visits:', err);
      res.status(500).json({ error: 'Database error' });
    } else {
      if (result.length > 0) {
        res.status(200).json(result);
      } else {
        res.status(404).json({ message: "Data doesn't exist in the Visits table" });
      }
    }
  });
});

app.post('/getVisitsData', (req, res) => {
  const { anganwadiNo, childsName } = req.body;
  console.log(anganwadiNo, childsName);
  const query = `SELECT * FROM visits WHERE anganwadiNo = ? AND  childName = ?`;

  db.query(query, [anganwadiNo, childsName], (err, results) => {
    console.log('Sending response data:', results);
    if (err) {
      console.error('Error executing database query: ', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ message: 'Data not found' });
    } else {
      res.status(200).json({ data: results });
      console.log(results);
    }
  });
});

app.post('/checkDataMedical', (req, res) => {
  const { anganwadiNo, childsName } = req.body;
  console.log(anganwadiNo, childsName);
  // Query the database to check if the data exists
  const sql = 'SELECT * FROM GeneralHistory WHERE anganwadiNo = ? AND childName  = ?';
  const values = [anganwadiNo, childsName];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error querying the database: ', err);
      res.status(500).json({ error: 'Database error' });
    } else {
      if (result.length > 0) {
        // Data exists in the database
        res.status(200).json({ message: 'Data exists in the database' });
      } else {
        // Data does not exist in the database
        res.status(404).json({ message: "Data doesn't exist in the database" });
      }
    }
  });
});

//below api was for BitNamevsGender og code
// app.get('/api/getGenderData', (req, res) => {
//   const anganwadiNo = req.query.anganwadiNo;
//   const query = 'SELECT childGender, COUNT(*) AS count FROM customers WHERE anganwadiNo = ? GROUP BY childGender'; // Replace with your table name
//   db.query(query, [anganwadiNo], (err, results) => {
//     if (err) {
//       console.error('Error fetching gender data:', err);
//       res.status(500).json({ error: 'Internal Server Error' });
//     } else {
//       console.log(results);
//       res.json(results);
//     }
//   });
// });

// API endpoint to fetch data
app.get('/getGenderData', (req, res) => {
  const query = `
    SELECT bitName, childGender
    FROM customers
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('MySQL query error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    console.log(results);
    res.json(results);
  });
});

app.get('/api/getUniqueAnganwadiNos', (req, res) => {
  const query = 'SELECT DISTINCT anganwadiNo FROM customers'; // Replace with your table name
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching unique anganwadi numbers:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      const uniqueAnganwadiNos = results.map((row) => row.anganwadiNo);
      res.json(uniqueAnganwadiNos);
    }
  });
});

// app.get('/childGenderData', (req, res) => {
//   const sql = 'SELECT bitName, childGender, COUNT(*) as count FROM Customers GROUP BY bitName, childGender';
//   db.query(sql, (err, result) => {
//     if (err) {
//       console.error('Error querying the database: ', err);
//       res.status(500).json({ error: 'Database error' });
//     } else {
//       console.log(result);
//       res.json(result);
//     }
//   });
// });

app.get('/childGenderData', (req, res) => {
  // Replace 'your_table_name' with the name of your MySQL table
  const query = 'SELECT * FROM Customers';
  console.log("childGenderData API is getting hit");
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing MySQL query: ', err);
      res.status(500).json({ error: 'Error fetching data' });
    } else {
      res.json(results);
    }
    console.log("Result of SELECT * FROM Customers: ", results);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});