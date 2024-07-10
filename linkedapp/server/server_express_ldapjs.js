const express = require('express');
const ldap = require('ldapjs');
const cors = require('cors');

const app = express();
const port = 3000;

// Use CORS middleware
// permet de reglementer la provenance des calls api
app.use(cors({
    origin: 'http://localhost:4200'
  }));

// Create an LDAP client
const ldapClient = ldap.createClient({
  url: 'ldap://localhost:389'
});

app.use(express.json());

// Route Auth, permet de teste login + mdp d'un user
app.post('/verify-auth', (req, res) => {
  const { username, password } = req.body;

  // Bind to the LDAP server using the user's credentials
  ldapClient.bind(`cn=${username},ou=users,dc=mycompany,dc=com`, password, (err) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    res.json({ message: 'Credentials are valid' });
  });
});



// Route changepasseword, permet de changer le mdp d'un user
app.post('/change-password', (req, res) => {
  const { username, oldPassword, newPassword } = req.body;

    // Create a change object to update the password, neccesaire et tres norme
    const change = new ldap.Change({
      operation: 'replace',
      modification: new ldap.Attribute({ 
        type: 'userPassword',
        values: [newPassword]
      })
    });

    // Modify the user's password
    ldapClient.modify(`cn=${username},ou=users,dc=mycompany,dc=com`, change, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Password change failed' });
      }

      res.json({ message: 'Password changed successfully' });
    });
  });



// run le express / ldapjs server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
