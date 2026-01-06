const mongoose = require('mongoose');
const Item = require('./src/models/Item');
const User = require('./src/models/User');
const dotenv = require('dotenv');

dotenv.config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        const items = await Item.find({}).sort({ createdAt: -1 }).limit(5);
        const users = await User.find({}).sort({ createdAt: -1 }).limit(5);

        console.log('Recent Items:');
        items.forEach(i => console.log(`${i.title} - ${i.createdAt}`));

        console.log('\nRecent Users:');
        users.forEach(u => console.log(`${u.name} - ${u.createdAt}`));

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

run();
