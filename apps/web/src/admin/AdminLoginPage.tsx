import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { adminLoginSchema, AdminLoginInput } from '@momera/shared';
import { RoyalInput } from '../components/common/RoyalInput';
import { RoyalButton } from '../components/common/RoyalButton';
import { MomeraLogo } from '../components/common/MomeraLogo';
import { GoldDivider } from '../components/common/GoldDivider';
import { api } from '../services/api';
import { ShieldCheck, AlertCircle } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginInput>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: 'admin@mirstoera.in',
      password: '',
    },
  });

  const onSubmit = async (data: AdminLoginInput) => {
    setIsLoading(true);
    setServerError(null);

    try {
      await api.adminLogin(data);
      navigate('/admin/dashboard', { replace: true });
    } catch (err: any) {
      setServerError(err.message || 'Invalid administrative credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#16283D] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#FCF9F2] border-2 border-[#C8A45D] p-8 sm:p-10 rounded-sm shadow-royal text-center space-y-6 relative">
        <div className="w-16 h-16 rounded-full bg-[#16283D] mx-auto flex items-center justify-center border-2 border-[#C8A45D] shadow-md p-2">
          <MomeraLogo variant="emblem" size={44} alt="MIRSTOERA Emblem" />
        </div>

        <div>
          <span className="text-[10px] uppercase font-semibold tracking-widest text-[#9B7833] block">
            Administrative Access
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#16283D]">
            MIRSTOERA Concierge
          </h1>
          <GoldDivider className="my-3" withCrown={false} />
        </div>

        {serverError && (
          <div className="p-3 bg-red-50 border border-[#692D40] rounded-sm text-xs text-[#692D40] flex items-center gap-2 text-left">
            <AlertCircle size={16} className="shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left" noValidate>
          <RoyalInput
            label="Staff Email"
            type="email"
            required
            placeholder="admin@mirstoera.in"
            error={errors.email?.message}
            {...register('email')}
          />

          <RoyalInput
            label="Password"
            type="password"
            required
            placeholder="••••••••••••"
            error={errors.password?.message}
            {...register('password')}
          />

          <div className="pt-2">
            <RoyalButton
              type="submit"
              variant="royal-navy"
              size="lg"
              fullWidth
              isLoading={isLoading}
            >
              Sign In to Concierge Portal
            </RoyalButton>
          </div>
        </form>

        <p className="text-[11px] text-[#292623]/60 flex items-center justify-center gap-1.5 pt-2">
          <ShieldCheck size={14} className="text-[#C8A45D]" /> Authorized personnel only. All access attempts are audited.
        </p>
      </div>
    </div>
  );
};
