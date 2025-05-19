const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Connexion MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connecté à MongoDB'))
.catch((error) => {
  console.error('❌ Erreur de connexion à MongoDB :', error.message);
  process.exit(1); 
});

// Routes API
const taskRoutes = require('./routes/tasks');
const authRoutes = require('./routes/auth');
app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes);


// Lancer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur le port ${PORT}`);
});
