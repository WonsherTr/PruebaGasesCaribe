import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Container, Box, Typography } from '@mui/material';
import { api, authHeader } from './api';
import RoutesEnum from './routes';

function Login(){
  const { control, handleSubmit } = useForm({ defaultValues: { email: '', password: '' } });
  const onSubmit = async ({ email, password }) => {
    // Usa login dummy si no hay password; si hay, login real
    const path = password ? '/auth/login/real' : '/auth/login';
    const body = password ? { email, password } : { email };
    const { token } = await api(path, { method: 'POST', body: JSON.stringify(body) });
    localStorage.setItem('token', token);
    window.location.href = RoutesEnum.PROFILE;
  };
  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Typography variant="h5">Iniciar sesión</Typography>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'grid', gap: 2, mt: 2 }}>
        <Controller name="email" control={control} rules={{ required: 'Email is required' }}
          render={({ field, fieldState }) => (
            <TextField {...field} label="Email" error={!!fieldState.error} helperText={fieldState.error?.message} />
          )} />
        <Controller name="password" control={control}
          render={({ field }) => (<TextField {...field} type="password" label="Password (opcional para login real)" />)} />
        <Button type="submit" variant="contained">Entrar</Button>
        <Typography variant="body2">¿No tienes cuenta? <Link to={RoutesEnum.REGISTER}>Regístrate</Link></Typography>
      </Box>
    </Container>
  );
}

function Register(){
  const { control, handleSubmit } = useForm({ defaultValues: { firstName:'', lastName:'', email:'', password:'' } });
  const onSubmit = async (data) => {
    await api('/auth/register', { method: 'POST', body: JSON.stringify(data) });
    alert('Cuenta creada. Ahora inicia sesión.');
    window.location.href = RoutesEnum.ROOT;
  };
  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Typography variant="h5">Registro</Typography>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'grid', gap: 2, mt: 2 }}>
        <Controller name="firstName" control={control} rules={{ required:'Nombre requerido' }}
          render={({ field, fieldState }) => (<TextField {...field} label="Nombre" error={!!fieldState.error} helperText={fieldState.error?.message} />)} />
        <Controller name="lastName" control={control} rules={{ required:'Apellido requerido' }}
          render={({ field, fieldState }) => (<TextField {...field} label="Apellido" error={!!fieldState.error} helperText={fieldState.error?.message} />)} />
        <Controller name="email" control={control} rules={{ required:'Email requerido' }}
          render={({ field, fieldState }) => (<TextField {...field} label="Email" error={!!fieldState.error} helperText={fieldState.error?.message} />)} />
        <Controller name="password" control={control} rules={{ required:'Contraseña requerida', minLength:{value:6, message:'Mínimo 6 caracteres'} }}
          render={({ field, fieldState }) => (<TextField type="password" {...field} label="Contraseña" error={!!fieldState.error} helperText={fieldState.error?.message} />)} />
        <Button type="submit" variant="contained">Crear cuenta</Button>
      </Box>
    </Container>
  );
}

function Profile(){
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to={RoutesEnum.ROOT} />;

  const getMe = async () => {
    try {
      const me = await api('/profile/me', { headers: authHeader() });
      alert(JSON.stringify(me, null, 2));
    } catch (e) {
      alert('Error: ' + e.message);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Typography variant="h5">Perfil</Typography>
      <Box sx={{ display:'flex', gap:1, mt:2 }}>
        <Button onClick={getMe} variant="outlined">Ver mi perfil</Button>
        <Button onClick={()=>{ localStorage.removeItem('token'); window.location.href = RoutesEnum.ROOT; }}>
          Cerrar sesión
        </Button>
      </Box>
    </Container>
  );
}

export default function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path={RoutesEnum.ROOT} element={<Login/>} />
        <Route path={RoutesEnum.REGISTER} element={<Register/>} />
        <Route path={RoutesEnum.PROFILE} element={<Profile/>} />
        <Route path="*" element={<Navigate to={RoutesEnum.ROOT} />} />
      </Routes>
    </BrowserRouter>
  );
}
