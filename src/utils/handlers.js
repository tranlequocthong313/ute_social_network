import { rest } from 'msw';

const user = {
    id: 5,
    email: 'admin@gmail.com',
    password: 'password',
};

export const handlers = [
    rest.post('http://192.168.1.175:3000/login', (req, res, ctx) => {
        const { email, password } = req.body;
        if (email === user.email && password === user.password) {
            console.log(`return`);
            return res(
                ctx.status(200),
                ctx.json({
                    accessToken:
                        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRyYW5sZXF1b2N0aG9uZzMxM0BnbWFpbC5jb20iLCJpYXQiOjE2OTU5MTgwNTAsImV4cCI6MTY5NTkyMTY1MCwic3ViIjoiNSJ9.dDq6dSwCpvqztVDM2viIeF-qSJaRpUUJnd9LXRq4x3s',
                    user: {
                        id: user.id,
                        email: user.email,
                    },
                }),
            );
        } else {
            return res(
                ctx.status(400),
                ctx.json({
                    message: 'Incorrect email or password',
                }),
            );
        }
    }),
];
