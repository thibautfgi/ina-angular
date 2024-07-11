const express = require('express'); // node.js frawmework pour web et mobile application
const ldap = require('ldapjs'); // js framework pour ldap client & server pour web et mobile app, permet l'interaction avec http service
const cors = require('cors'); // permet de reglementer la provenance des calls api

const app = express();
const port = 3000;

// Use CORS middleware
app.use(cors({
    origin: 'http://localhost:4200' // laisse passer uniquement le port 4200 localhost
  }));

// Create an LDAP client
const ldapClient = ldap.createClient({
  url: 'ldap://localhost:389' // notre port du ldap (setup dans docker-compose openldap)
});

app.use(express.json()); 

// l'endpoint Auth, permet de teste login + mdp d'un user
app.post('/verify-auth', (req, res) => {
  const { username, password } = req.body;

  // ldapClient.bind = essaye de ce connecter avec les login + mdp et renvoie une reponse
  ldapClient.bind(`cn=${username},ou=users,dc=mycompany,dc=com`, password, (err) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    res.json({ message: 'Credentials are valid' });
  });
});



// L'endpoint changepasseword, permet de changer le mdp d'un user 
app.post('/change-password', (req, res) => {
  const { username, newPassword } = req.body;

    // Cree un "change object ldap.change et ldap.attribute", neccesaire et tres norme
    const change = new ldap.Change({  
      operation: 'replace',
      modification: new ldap.Attribute({ 
        type: 'userPassword',
        values: [newPassword]
      })
    });

    // ldapClient.modify === fais un changement dans le ldap, modify le password de l'user
    ldapClient.modify(`cn=${username},ou=users,dc=mycompany,dc=com`, change, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Password change failed' });
      }

      res.json({ message: 'Password changed successfully' });
    });
  });



// run le express/ldapjs server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
