const express = require('express');
const ldap = require('ldapjs');

const app = express();
const port = 3000;

// Create an LDAP client
const ldapClient = ldap.createClient({
  url: 'ldap://localhost:389'
});

app.use(express.json());


// Route to verify the user's credentials
app.post('/verify-auth', (req, res) => {
    const { username, password } = req.body;
  
    // Bind to the LDAP server using the user's credentials
    ldapClient.bind(`cn=${username},ou=users,dc=mycompany,dc=com`, password, (err) => {
      if (err) {
        return res.status(401).send('Invalid credentials');
      }
      res.send('Credentials are valid');
    });
  });




app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
