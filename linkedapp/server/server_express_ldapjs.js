const express = require('express');
const ldap = require('ldapjs');

const app = express();
const port = 3000;

// Create an LDAP client
const ldapClient = ldap.createClient({
  url: 'ldap://localhost:389'
});

app.get('/', (req, res) => {
    res.send('Hello World!')
  })

app.use(express.json());

// 
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});



// Route to change the user's password
// app.post('/change-password', (req, res) => {
//   const { username, oldPassword, newPassword } = req.body;

//   // Bind to the LDAP server using the user's credentials
//   ldapClient.bind(`cn=${username},dc=mycompany,dc=com`, oldPassword, (err) => {
//     if (err) {
//       return res.status(401).send('Invalid credentials');
//     }

//     // Create a change object to update the password
//     const change = new ldap.Change({
//       operation: 'replace',
//       modification: {
//         userPassword: newPassword
//       }
//     });

//     // Modify the user's password
//     ldapClient.modify(`cn=${username},dc=mycompany,dc=com`, change, (err) => {
//       if (err) {
//         return res.status(500).send('Password change failed');
//       }

//       res.send('Password changed successfully');
//     });
//   });
// });

