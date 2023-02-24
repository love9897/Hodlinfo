//database connection
const  {Client} = require('pg');

const client = new Client({
    host: "localhost",
    user: 'postgres',
    port: 5432,
    password:'7598',
    database:'hodlinfo'

});

client.connect();


// fetch data from database
const express = require('express');
const path  = require('path');
const app = express();



const staticPath = path.join(__dirname,"../index");
app.use(express.static(staticPath));

app.get('/users', (req, res) => {
  client.query('SELECT * FROM public."Data"', (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error fetching data from database');
    } else {
      res.json(result.rows);
    }
  });
});


app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});




//insert data into database
const axios =  require('axios');

async function getData() {
  try {
    const response = await axios.get('https://api.wazirx.com/api/v2/tickers');
    const data = response.data;
    const query = 'DELETE FROM public."Data"';
    client.query(query, (err, res) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(`Deleted ${res.rowCount} row(s)`);
  
});

    
    const listdata = ['btcinr','xrpinr','ethinr','trxinr','eosinr','zilinr','batinr','zrxinr','reqinr','nulsinr'];
    for(let i=0;i<=listdata.length;i++){
      const key = listdata[i]; 
      const item =  data[key];
      
      const text = 'INSERT INTO public."Data"(name,last,buy,sell,volume,baseunit ) VALUES($1, $2, $3, $4, $5,$6) RETURNING *';
    const values = [item.name,item.last,item.buy,item.sell,item.volume,item.base_unit];
    client.query(text, values, (err, res) => {
        if (err) {
          console.error(err);
        } else {
          console.log("succefully inserdted");
        }
      });
   
  }//for loop 
  }
    catch (error) {
      console.error(error);
    } 

    }

    getData();



