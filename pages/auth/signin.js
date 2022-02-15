import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';

import { Button, TextInput } from '../../components/shared';
import { API_URL } from '../../constants';

export default function SignIn() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        user: data,
      });
      localStorage.setItem('auth-token', response.data.token);
      toast.success('Logged in successfully!');
      router.push('/builder');
    } catch (e) {
      !e.response?.data && toast.error(e.message);
      e.response?.data && Object.values(e.response?.data).forEach(toast.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className='flex flex-col md:flex-row w-full h-screen md:justify-evenly items-center relative bg-gradient-to-tr from-white to-blue-100 pb-60 md:pb-0'>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex flex-col my-8 md:my-36 rounded shadow w-11/12 md:w-5/12 px-3 md:px-20 pt-10 pb-20 bg-white'
      >
        <header className='font-bold text-2xl mb-4 text-center'>Login</header>
        <TextInput
          type='email'
          placeholder='Email'
          helpText={errors.email?.message}
          {...register('email', {
            required: 'Email is required!',
            pattern: /^\S+@\S+$/i,
          })}
        />
        <TextInput
          type='password'
          placeholder='Password'
          {...register('password')}
        />

        <Button isLoading={loading} type='submit' className='mt-5'>
          Login
        </Button>
      </form>
      <div className='card bg-white px-10 py-3 hover:shadow-2xl'>
        <Link href='/auth/signup'>
          <a className='font-medium text-2xl text-blue-600'>
            Or register here...
          </a>
        </Link>
      </div>
    </section>
  );
}
