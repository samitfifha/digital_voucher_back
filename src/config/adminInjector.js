import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const injectAdmin = async () => {
  const adminEmail = process.env.ADMIN_EMAIL; // Admin email 
  const adminPassword = process.env.ADMIN_PASSWORD; // Admin password (plain text) 
  const hashedPassword = await bcrypt.hash(adminPassword, 10); // Encrypt the password

  // Check if the admin user already exists
  const adminUser = await User.findOneAndUpdate(
    { email: adminEmail }, // Find by email
    {
      $setOnInsert: { // Only set these fields if the user is created (not updated)
        name: 'Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
      },
    },
    { upsert: true, new: true } // Create if not found
  );

  if (adminUser) {
    console.log('Admin user injected successfully:', adminUser.email);
  } else {
    console.log('Admin user already exists:', adminEmail);
  }
};

export default injectAdmin;