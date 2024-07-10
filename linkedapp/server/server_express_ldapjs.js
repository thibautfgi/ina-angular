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

// Route to verify the user's credentials
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

// Route to change the user's password
app.post('/change-password', (req, res) => {
  const { username, oldPassword, newPassword } = req.body;


    // Create a change object to update the password
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


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
