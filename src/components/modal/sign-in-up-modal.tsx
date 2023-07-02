import { useState } from 'react';
import { InputField } from '@components/input/input-field';
import { Button } from '@components/ui/button';

interface SignInUpModalProps {
  signInWithEmailPassword: (email: string, password: string) => Promise<void>;
  signUpWithEmailPassword: (email: string, password: string) => Promise<void>;
}

export function SignInUpModal({ signInWithEmailPassword, signUpWithEmailPassword }: SignInUpModalProps): JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (): Promise<void> => {
    try {
      await signInWithEmailPassword(email, password);
    } catch(error) {
      try {
        await signUpWithEmailPassword(email, password);
      } catch (error) {
        setError('Error email or password.');
      }
    }
  };

  return (
    <>
    <form onClick={(e) => e.stopPropagation()}>
      <div style={{ marginBottom: '1rem' }}>
      <InputField 
        label='Email' 
        inputId='email' 
        inputValue={email} 
        handleChange={(e) => setEmail(e.target.value)} 
      />
      </div>
      <div style={{ marginBottom: '1rem' }}>
      <InputField 
        label='Password' 
        inputId='password' 
        password={true}
        inputValue={password} 
        handleChange={(e) => setPassword(e.target.value)} 
      />
      </div>
      <Button className='bg-accent-green width-100 text-white transition hover:brightness-90
                         focus-visible:!ring-accent-blue/80 focus-visible:brightness-90 active:brightness-75' onClick={handleSignIn}>Sign In</Button>
      {error && <p style={{color:'red', marginTop: '12px', lineHeight: '20px', textAlign: 'center'}} >{error}</p>}
      </form>
    </>
  );
}
