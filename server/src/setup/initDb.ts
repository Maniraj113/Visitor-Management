import db from '../models/database';

const initializeUsers = () => {
    const users = [
        {
            username: 'admin',
            password: 'admin123',
            role: 'admin'
        },
        {
            username: 'security',
            password: 'security123',
            role: 'security'
        }
    ];

    users.forEach(user => {
        db.run(
            'INSERT OR IGNORE INTO users (username, password, role) VALUES (?, ?, ?)',
            [user.username, user.password, user.role],
            (err: Error | null) => {
                if (err) {
                    console.error('Error inserting user:', err);
                } else {
                    console.log(`User ${user.username} created successfully`);
                }
            }
        );
    });
};

export default initializeUsers; 