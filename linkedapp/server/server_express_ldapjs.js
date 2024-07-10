const express = require('express');
const ldap = require('ldapjs');
const cors = require('cors');

const app = express();
const port = 3000;

// Use CORS middleware
app.use(cors());

// Create an LDAP client
const ldapClient = ldap.createClient({
  url: 'ldap://localhost:389'
});

app.use(express.json());

// Route 
app.post('/verify-auth', (req, res) => {
  const { username, password } = req.body;

    // test de auth
  ldapClient.bind(`cn=${username},ou=users,dc=mycompany,dc=com`, password, (err) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid credentials' }); 
    }
    res.json({ message: 'Credentials are valid' });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
