const express = require('express'); // node.js frawmework pour web et mobile application
const ldap = require('ldapjs'); // js framework pour ldap client & server pour web et mobile app, permet l'interaction avec http service
const cors = require('cors'); // permet de reglementer la provenance des calls api

const app = express();
const port = 3000;

// Use CORS middleware
// peux me permette d'acepter des calls api que de certaine adresse cible
app.use(cors());

// Create an LDAP client
const ldapClient = ldap.createClient({
  url: 'ldap://' + process.env.SERVERLDAP // notre port du ldap (setup dans docker-compose openldap)
});

app.use(express.json()); 

// l'endpoint Auth, permet de teste login + mdp d'un user
app.post('/verify-auth', (req, res) => {
  const { username, password } = req.body;

  console.log('Received auth request:', { username}); // c'est pas très secure non???

  // ldapClient.bind = essaye de ce connecter avec les login + mdp et renvoie une reponse
  ldapClient.bind(`cn=${username},ou=users,dc=mycompany,dc=com`, password, (err) => {
    if (err) {

      console.error('Login ou mdp invalide for user:', username);

      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('Utilisateur approuvé ! Nom :', username);

    res.json({ message: 'Credentials are valid' });
  });
});

// L'endpoint changepasseword, permet de changer le mdp d'un user 
app.post('/change-password', (req, res) => {
  const { username, newPassword } = req.body;

  console.log('Received password change request for user:', username);

  // Cree un "change object ldap.change et ldap.attribute", neccesaire et tres norme
  const change = new ldap.Change({  
    operation: 'replace',
    modification: new ldap.Attribute({ 
      type: 'userPassword',
      values: [newPassword]
    })
  });

  console.log('LDAP change object created:', change);

  // ldapClient.modify === fais un changement dans le ldap, modify le password de l'user

  // ADAPTER LA LOGIC DE CONNECTION DE LDAP ICI en fct de l'arborescence de l'entreprise 
  ldapClient.modify(`cn=${username},ou=users,dc=mycompany,dc=com`, change, (err) => {
    if (err) {

      console.error('Password change failed for user:', username);
      
      return res.status(500).json({ message: 'Password change failed' });
    }

    console.log('Password changed successfully for user:', username);

    res.json({ message: 'Password changed successfully' });
  });
});


// Middleware to handle 404 errors
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
  console.error('404 Not Found:', req.originalUrl);
});

// Global error handling middleware
app.use((err, res) => {
  res.status(500).json({ message: 'Internal Server Error' });
  console.error('Unexpected server error:', err);
});

// run le express/ldapjs server
app.listen(port, () => {
  console.log(`Server_express_ldap.js est en marche sur le port : http://localhost:${port}`);
});

// permet d'envoye des tests sans demarer directement le server
module.exports = app;
