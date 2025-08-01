
// src/components/SignupForm.jsx
import React, { useState } from 'react';
import { Box, TextInput, PasswordInput, Paper, Group, Button, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import axios from 'axios';

export default function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  const form = useForm({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },

    validate: {
      username: (value) => (value.length < 3 ? 'Username must be at least 3 characters' : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length < 6 ? 'Password must be at least 6 characters' : null),
      confirmPassword: (value, values) =>
        value !== values.password ? 'Passwords do not match' : null,
    },
  });


  const handleSubmit = async (values) => {
    setIsLoading(true);
    setErrors([]);

    try {
        const response = await axios.post('/signup', {
            username: values.username,
            email: values.email,
            password: values.password,
            password_confirmation: values.confirmPassword,
        });

        const { user } = response.data;
        console.log('Signed up user:', user);

        setIsLoading(false);

    } catch (error) {
        setIsLoading(false);

        if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
        } else {
        setErrors(['Signup failed']);
        }
    }
  }

  return (
    <Box
      style={{
        height: '100vh',           
        display: 'flex',           
        alignItems: 'center',      
        justifyContent: 'center',  
      }}
    >
      <Paper shadow="md" radius="md" p="xl" withBorder maw={400} w="100%">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
                label="Username"
                placeholder="your_username"
                {...form.getInputProps('username')}
                required
            />
            <TextInput
                label="Email"
                placeholder="your@email.com"
                {...form.getInputProps('email')}
                required
            />
            <PasswordInput
                label="Password"
                placeholder="Your password"
                {...form.getInputProps('password')}
                required
            />
            <PasswordInput
                label="Confirm Password"
                placeholder="Re-enter password"
                {...form.getInputProps('confirmPassword')}
                required
            />
            </Stack>

            <Group justify="flex-end" mt="md">
              <Button type="submit" loading={isLoading}>Sign Up</Button>
            </Group>

            {errors.length > 0 && (
              <ul style={{ color: 'red' }}>
                {errors.map((err, i) => <li key={i}>{err}</li>)}
              </ul>
            )}
        </form>
      </Paper>
    </Box>
  );
}


















// // src/components/SignupForm.jsx
// import React, { useState } from 'react';
// import { TextInput, PasswordInput, Paper, Group, Button, Stack } from '@mantine/core';
// import { useForm } from '@mantine/form';

// export default function SignupForm({ onLogin }) {
//   const [isLoading, setIsLoading] = useState(false);
//   const [errors, setErrors] = useState([]);

//   const form = useForm({
//     initialValues: {
//       username: '',
//       email: '',
//       password: '',
//       confirmPassword: '',
//     },

//     validate: {
//       username: (value) => (value.length < 3 ? 'Username must be at least 3 characters' : null),
//       email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
//       password: (value) => (value.length < 6 ? 'Password must be at least 6 characters' : null),
//       confirmPassword: (value, values) =>
//         value !== values.password ? 'Passwords do not match' : null,
//     },
//   });


//   const handleSubmit = async (values) => {
//     setIsLoading(true);
//     setErrors([]);

//     try {
//       const response = await fetch("/signup", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//             username: values.username,
//             email: values.email,
//             password: values.password,
//             password_confirmation: values.confirmPassword,
//         }),
//       });

//       const data = await response.json();
//       setIsLoading(false);

//       if (response.ok) {
//         const { token, user } = data;
//         // onLogin(token, user);
//       } else {
//         setErrors(data.errors || ['Signup failed']);
//       } 
//     } catch (err) {
//         setIsLoading(false);
//         setErrors(['Network error']);
//     }
//   }

//   return (
//     <Paper shadow="md" radius="md" p="xl" withBorder maw={400} mx="auto">
//       <form onSubmit={form.onSubmit(handleSubmit)}>
//         <Stack>
//           <TextInput
//             label="Username"
//             placeholder="your_username"
//             {...form.getInputProps('username')}
//             required
//           />
//           <TextInput
//             label="Email"
//             placeholder="your@email.com"
//             {...form.getInputProps('email')}
//             required
//           />
//           <PasswordInput
//             label="Password"
//             placeholder="Your password"
//             {...form.getInputProps('password')}
//             required
//           />
//           <PasswordInput
//             label="Confirm Password"
//             placeholder="Re-enter password"
//             {...form.getInputProps('confirmPassword')}
//             required
//           />
//         </Stack>

//         <Group justify="flex-end" mt="md">
//           <Button type="submit" loading={isLoading}>Sign Up</Button>
//         </Group>

//         {errors.length > 0 && (
//           <ul style={{ color: 'red' }}>
//             {errors.map((err, i) => <li key={i}>{err}</li>)}
//           </ul>
//         )}
//       </form>
//     </Paper>
//   );
// }